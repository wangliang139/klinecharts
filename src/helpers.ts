import { Chart, Nullable, Overlay, YAxis } from "klinecharts"
import { FontWeights } from "./types/types"

/** 西式分组：千分位 `,`、小数 `.`（如 12,345.67） */
export function formatWesternGrouped(value: number, fractionDigits: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: true,
  }).format(value)
}

export const getScreenSize = () => {
	return {x: window.innerWidth, y: window.innerHeight}
}

export const getPrecision = (chart: Chart, overlay: Overlay<unknown>, yAxis: Nullable<YAxis>):{ price: number, volume: number } => {
	const precision = {
		price: 0,
		volume: 0
	}

	const symbol = chart.getSymbol()
	if ((yAxis?.isInCandle() ?? true) && symbol) {
		precision.price = symbol.pricePrecision
		precision.volume = symbol.volumePrecision
	} else {
		const indicators = chart.getIndicators({ paneId: overlay.paneId })
		indicators.forEach(indicator => {
			precision.price = Math.max(precision.price, indicator.precision)
		})
	}

	return precision
}

export const convertFontweightNameToNumber = (weight: FontWeights): number => {
	const weights: { [key: string]: number } = {
		'thin': 100, 'extra-light': 200, 'light': 300, 'normal': 400, 'medium': 500, 'semi-bold': 600, 'bold': 700, 'extra-bold': 800, 'black': 900
	}

	return weights[weight]
}

export const formatTimeByTz = (timestamp: number, locale: string, timezone: string): string => {
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timezone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		}).format(timestamp)
	} catch {
		return new Date(timestamp).toLocaleString(locale)
	}
}