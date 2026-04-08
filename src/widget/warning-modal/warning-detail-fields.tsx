import { Component, Show } from 'solid-js'

import { WarningFrequency, WarningItem, WarningType, WarningWindow } from '../../types/types'

function labelWarningType(t: WarningType): string {
  switch (t) {
    case 'price_reach': return '价格达到'
    case 'price_rise_to': return '价格上涨至'
    case 'price_fall_to': return '价格下跌至'
    case 'price_rise_pct_over': return '价格涨幅超过'
    case 'price_fall_pct_over': return '价格跌幅超过'
  }
}

function labelFrequency(f: WarningFrequency): string {
  return f === 'repeat' ? '重复提醒' : '仅提醒一次'
}

function labelWindow(w: WarningWindow | undefined): string {
  switch (w) {
    case '5m': return '5分'
    case '1h': return '1小时'
    case '4h': return '4小时'
    case '24h': return '24小时'
    default: return '—'
  }
}

export const WarningDetailFields: Component<{ warning: WarningItem }> = (props) => (
  <dl class="warning-detail-grid">
    <Show when={!!props.warning.symbol}>
      <dt>标的</dt>
      <dd>{props.warning.symbol}</dd>
    </Show>
    <dt>类型</dt>
    <dd>{labelWarningType(props.warning.type)}</dd>
    <Show when={props.warning.price != null && Number.isFinite(props.warning.price)}>
      <dt>价格</dt>
      <dd>{String(props.warning.price)}</dd>
    </Show>
    <Show when={props.warning.window != null}>
      <dt>时间窗口</dt>
      <dd>{labelWindow(props.warning.window)}</dd>
    </Show>
    <Show when={props.warning.percent != null}>
      <dt>百分比</dt>
      <dd>{`${props.warning.percent}%`}</dd>
    </Show>
    <dt>频率</dt>
    <dd>{labelFrequency(props.warning.frequency)}</dd>
    <dt>备注</dt>
    <dd>{props.warning.remark?.trim() ? props.warning.remark : '—'}</dd>
  </dl>
)
