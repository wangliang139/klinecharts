import { ChartObjType, Period } from '../types'
import { CHART_STATE_STORAGE_KEY } from './tradingStore'

function isValidStoredPeriod (input: unknown): input is Pick<Period, 'span' | 'type'> & Partial<Pick<Period, 'text'>> {
  if (typeof input !== 'object' || input === null) return false
  const period = input as Partial<Period>
  return typeof period.span === 'number' && Number.isFinite(period.span) && typeof period.type === 'string'
}

function readChartState (): ChartObjType {
  try {
    const raw = localStorage.getItem(CHART_STATE_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ChartObjType
  } catch {
    return {}
  }
}

function writeChartState (state: ChartObjType): void {
  localStorage.setItem(CHART_STATE_STORAGE_KEY, JSON.stringify(state))
}

export function isSamePeriod (left?: Period | null, right?: Period | null): boolean {
  if (!left || !right) return false
  return left.span === right.span && left.type === right.type
}

export function findMatchedPeriod (periods: Period[], target?: Period | null): Period | null {
  if (!target) return null
  return periods.find(period => isSamePeriod(period, target)) ?? null
}

export function loadSavedPeriod (): Period | null {
  const state = readChartState()
  if (!isValidStoredPeriod(state.period)) return null
  return {
    span: state.period.span,
    type: state.period.type,
    text: typeof state.period.text === 'string' ? state.period.text : '',
  }
}

export function persistPeriod (period: Period): void {
  const state = readChartState()
  state.period = {
    span: period.span,
    type: period.type,
    text: period.text,
  }
  writeChartState(state)
}

export function resolveInitialPeriod (periods: Period[], fallbackPeriod: Period): Period {
  const savedPeriod = findMatchedPeriod(periods, loadSavedPeriod())
  if (savedPeriod) return savedPeriod

  const fallbackMatchedPeriod = findMatchedPeriod(periods, fallbackPeriod)
  if (fallbackMatchedPeriod) return fallbackMatchedPeriod

  return periods[0] ?? fallbackPeriod
}
