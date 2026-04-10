import i18n from '.'
import { formatWesternGrouped } from '../helpers'
import type { AlertFrequency, AlertItem, AlertType, AlertWindow } from '../types/types'

export function getAlertTypeText(type: AlertType, locale: string): string {
  switch (type) {
    case 'price_reach':
      return i18n('alert_type_price_reach', locale)
    case 'price_rise_to':
      return i18n('alert_type_price_rise_to', locale)
    case 'price_fall_to':
      return i18n('alert_type_price_fall_to', locale)
    case 'price_rise_pct_over':
      return i18n('alert_type_price_rise_pct_over', locale)
    default:
      return i18n('alert_type_price_fall_pct_over', locale)
  }
}

export function getAlertFrequencyText(frequency: AlertFrequency, locale: string): string {
  return i18n(frequency === 'repeat' ? 'alert_frequency_repeat' : 'alert_frequency_once', locale)
}

export function getAlertWindowText(window: AlertWindow | undefined, locale: string): string {
  switch (window) {
    case '5m':
      return i18n('alert_window_5m', locale)
    case '1h':
      return i18n('alert_window_1h', locale)
    case '4h':
      return i18n('alert_window_4h', locale)
    case '24h':
      return i18n('alert_window_24h', locale)
    default:
      return window ?? '--'
  }
}

export function getAlertSummaryText(alertItem: AlertItem, locale: string): string {
  if (alertItem.type === 'price_reach') return `${getAlertTypeText(alertItem.type, locale)} ${alertItem.price ?? '--'}`
  if (alertItem.type === 'price_rise_to') return `${getAlertTypeText(alertItem.type, locale)} ${alertItem.price ?? '--'}`
  if (alertItem.type === 'price_fall_to') return `${getAlertTypeText(alertItem.type, locale)} ${alertItem.price ?? '--'}`

  const windowText = getAlertWindowText(alertItem.window, locale)
  const percentText = `${alertItem.percent ?? '--'}%`
  if (locale === 'zh-CN') {
    if (alertItem.type === 'price_rise_pct_over') return `价格${windowText}涨幅 ${percentText}`
    return `价格${windowText}跌幅 ${percentText}`
  }
  if (alertItem.type === 'price_rise_pct_over') return `Price ${windowText} increase ${percentText}`
  return `Price ${windowText} decrease ${percentText}`
}

export function getAlertLineLabelText(alertItem: AlertItem, locale: string, precision = 2): string {
  const price = Number(alertItem.price ?? 0)
  const formattedPrice = formatWesternGrouped(Number.isFinite(price) ? price : 0, precision)
  if (alertItem.type === 'price_reach') return `${getAlertTypeText(alertItem.type, locale)} ${formattedPrice}`
  if (alertItem.type === 'price_rise_to') return `${getAlertTypeText(alertItem.type, locale)} ${formattedPrice}`
  if (alertItem.type === 'price_fall_to') return `${getAlertTypeText(alertItem.type, locale)} ${formattedPrice}`

  const windowText = getAlertWindowText(alertItem.window, locale)
  const percentText = `${alertItem.percent ?? 0}%`
  if (locale === 'zh-CN') {
    if (alertItem.type === 'price_rise_pct_over') return `价格${windowText}涨幅 ${percentText}`
    return `价格${windowText}跌幅 ${percentText}`
  }
  if (alertItem.type === 'price_rise_pct_over') return `Price ${windowText} increase ${percentText}`
  return `Price ${windowText} decrease ${percentText}`
}
