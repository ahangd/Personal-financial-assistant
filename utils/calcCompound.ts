export type CompoundInputs = {
  initialInvestment: number
  monthlyContribution: number
  annualReturnRate: number // 0.06 = 6%
  years: number
  compoundsPerYear: number // e.g. 1, 4, 12, 365...
  inflationRate?: number // 0.03 = 3%
}

export type YearlyPoint = {
  year: number
  principal: number
  profit: number
  total: number
  realTotal?: number
  // Monte Carlo paths (optional keys, dynamic)
  [k: string]: number | undefined
}

export type MilestoneHit = {
  level: number
  year: number
  total: number
}

export type CompoundResult = {
  yearly: YearlyPoint[]
  milestones: MilestoneHit[]
  kpis: {
    finalTotal: number
    totalProfit: number
    multiple: number
    realPurchasingPower?: number
  }
}

function clampNumber(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min
  return Math.min(max, Math.max(min, v))
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function gaussian01(rand: () => number) {
  // Box–Muller transform
  let u = 0
  let v = 0
  while (u === 0) u = rand()
  while (v === 0) v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function toMonthlyEffectiveRate(annualNominal: number, compoundsPerYear: number) {
  const r = annualNominal
  const n = Math.max(1, compoundsPerYear)
  // nominal compounded n times -> EAR -> convert to monthly effective
  const ear = Math.pow(1 + r / n, n) - 1
  return Math.pow(1 + ear, 1 / 12) - 1
}

export function calcCompound(inputs: CompoundInputs): CompoundResult {
  const initialInvestment = clampNumber(inputs.initialInvestment, 0, 1e12)
  const monthlyContribution = clampNumber(inputs.monthlyContribution, 0, 1e10)
  const annualReturnRate = clampNumber(inputs.annualReturnRate, -0.99, 5)
  const years = Math.round(clampNumber(inputs.years, 1, 60))
  const compoundsPerYear = Math.round(clampNumber(inputs.compoundsPerYear, 1, 365))
  const inflationRate =
    inputs.inflationRate === undefined
      ? undefined
      : clampNumber(inputs.inflationRate, -0.9, 1)

  const monthlyRate = toMonthlyEffectiveRate(annualReturnRate, compoundsPerYear)

  const yearly: YearlyPoint[] = []
  let balance = initialInvestment

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = (balance + monthlyContribution) * (1 + monthlyRate)
    }
    const principal = initialInvestment + monthlyContribution * 12 * y
    const total = balance
    const profit = total - principal
    const realTotal =
      inflationRate === undefined
        ? undefined
        : total / Math.pow(1 + inflationRate, y)
    yearly.push({ year: y, principal, profit, total, realTotal })
  }

  // Milestones (first year total crosses)
  const milestoneLevels = [100_000, 500_000, 1_000_000]
  const milestones: MilestoneHit[] = []
  for (const level of milestoneLevels) {
    const hit = yearly.find((p) => p.total >= level)
    if (hit) milestones.push({ level, year: hit.year, total: hit.total })
  }

  const finalTotal = yearly[yearly.length - 1]?.total ?? initialInvestment
  const finalPrincipal =
    initialInvestment + monthlyContribution * 12 * (yearly.length || 0)
  const totalProfit = finalTotal - finalPrincipal
  const multiple = finalPrincipal > 0 ? finalTotal / finalPrincipal : 0
  const realPurchasingPower =
    inflationRate === undefined
      ? undefined
      : finalTotal / Math.pow(1 + inflationRate, years)

  return {
    yearly,
    milestones,
    kpis: { finalTotal, totalProfit, multiple, realPurchasingPower },
  }
}

export type MonteCarloConfig = {
  paths: number
  annualVolatility: number // e.g. 0.15
  seed?: number
}

export function addMonteCarloSeries(
  yearlyBase: YearlyPoint[],
  inputs: CompoundInputs,
  config: MonteCarloConfig
): { yearlyWithSims: YearlyPoint[]; medianSeries: number[] } {
  const years = yearlyBase.length
  const paths = Math.round(clampNumber(config.paths, 1, 300))
  const annualVol = clampNumber(config.annualVolatility, 0, 2)
  const annualReturnRate = clampNumber(inputs.annualReturnRate, -0.99, 5)

  const initialInvestment = clampNumber(inputs.initialInvestment, 0, 1e12)
  const monthlyContribution = clampNumber(inputs.monthlyContribution, 0, 1e10)

  // Use lognormal-ish monthly process (GBM approximation)
  const muEffectiveAnnual = annualReturnRate
  const sigmaMonthly = annualVol / Math.sqrt(12)
  const driftMonthly =
    Math.log(1 + muEffectiveAnnual) / 12 - 0.5 * sigmaMonthly * sigmaMonthly

  // deterministic seed from inputs for stable UI
  const seedBase =
    config.seed ??
    Math.floor(
      (initialInvestment % 1e6) +
        (monthlyContribution % 1e5) * 10 +
        (annualReturnRate * 1e4 + 1e6) +
        years * 131 +
        paths * 17
    )

  const yearlyTotalsByPath: number[][] = Array.from({ length: paths }, () => [])

  for (let i = 0; i < paths; i++) {
    const rand = mulberry32((seedBase + i * 9973) >>> 0)
    let balance = initialInvestment
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        const z = gaussian01(rand)
        const logReturn = driftMonthly + sigmaMonthly * z
        balance = (balance + monthlyContribution) * Math.exp(logReturn)
      }
      yearlyTotalsByPath[i].push(balance)
    }
  }

  const yearlyWithSims: YearlyPoint[] = yearlyBase.map((p, idx) => {
    const out: YearlyPoint = { ...p }
    for (let i = 0; i < paths; i++) {
      out[`sim_${i}`] = yearlyTotalsByPath[i][idx]
    }
    return out
  })

  const medianSeries: number[] = []
  for (let y = 0; y < years; y++) {
    const values = yearlyTotalsByPath.map((arr) => arr[y]).sort((a, b) => a - b)
    const mid = Math.floor(values.length / 2)
    const med =
      values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid]
    medianSeries.push(med)
  }

  // attach median too (for easy charting)
  for (let y = 0; y < years; y++) {
    yearlyWithSims[y] = { ...yearlyWithSims[y], mcMedian: medianSeries[y] }
  }

  return { yearlyWithSims, medianSeries }
}

export const EXAMPLE_INPUTS: CompoundInputs = {
  initialInvestment: 100_000,
  monthlyContribution: 3_000,
  annualReturnRate: 0.07,
  years: 20,
  compoundsPerYear: 12,
  inflationRate: 0.03,
}

