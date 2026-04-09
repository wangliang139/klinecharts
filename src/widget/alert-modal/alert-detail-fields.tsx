import { Component, Show } from 'solid-js'

import { AlertFrequency, AlertItem, AlertType, AlertWindow } from '../../types/types'

function labelAlertType(t: AlertType): string {
  if (t === 'price_reach') return '价格达到'
  if (t === 'price_rise_to') return '价格上涨至'
  if (t === 'price_fall_to') return '价格下跌至'
  if (t === 'price_rise_pct_over') return '价格涨幅超过'
  return '价格跌幅超过'
}

function labelFrequency(f: AlertFrequency): string {
  return f === 'repeat' ? '重复提醒' : '仅提醒一次'
}

function labelWindow(w: AlertWindow | undefined): string {
  if (w === '5m') return '5分'
  if (w === '1h') return '1小时'
  if (w === '4h') return '4小时'
  if (w === '24h') return '24小时'
  return w ?? '—'
}

export const AlertDetailFields: Component<{ alert: AlertItem }> = (props) => (
  <dl class="alert-detail-grid">
    <Show when={!!props.alert.symbol}>
      <dt>标的</dt>
      <dd>{props.alert.symbol}</dd>
    </Show>
    <dt>类型</dt>
    <dd>{labelAlertType(props.alert.type)}</dd>
    <Show when={props.alert.price != null && Number.isFinite(props.alert.price)}>
      <dt>价格</dt>
      <dd>{String(props.alert.price)}</dd>
    </Show>
    <Show when={props.alert.window != null}>
      <dt>时间窗</dt>
      <dd>{labelWindow(props.alert.window)}</dd>
    </Show>
    <Show when={props.alert.percent != null}>
      <dt>百分比</dt>
      <dd>{`${props.alert.percent}%`}</dd>
    </Show>
    <dt>频率</dt>
    <dd>{labelFrequency(props.alert.frequency)}</dd>
    <dt>备注</dt>
    <dd>{props.alert.remark?.trim() ? props.alert.remark : '—'}</dd>
  </dl>
)
