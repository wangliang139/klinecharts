import { ChartObjType } from "../types";
import { CHART_STATE_STORAGE_KEY } from "./tradingStore";

function readChartState(): ChartObjType {
  try {
    const raw = localStorage.getItem(CHART_STATE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ChartObjType;
  } catch {
    return {};
  }
}

function writeChartState(state: ChartObjType): void {
  localStorage.setItem(CHART_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function loadSavedTimezone(): string | null {
  const state = readChartState();
  return typeof state.timezone === "string" && state.timezone.length > 0 ? state.timezone : null;
}

export function persistTimezone(timezone: string): void {
  const state = readChartState();
  state.timezone = timezone;
  writeChartState(state);
}

export function resolveInitialTimezone(fallbackTimezone: string): string {
  return loadSavedTimezone() ?? fallbackTimezone;
}
