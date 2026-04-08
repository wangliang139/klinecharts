import { Component, createSignal, For, Show } from 'solid-js'

import { Modal } from '../../component'
import { WarningFrequency, WarningItem, WarningItemInput, WarningType, WarningWindow } from '../../types/types'
import WarningAddModal from '../warning-add-modal'

export interface WarningModalProps {
  warnings: WarningItem[]
  onClose: () => void
  onAddWarning?: (warning: WarningItemInput) => void | Promise<void>
  onRemoveWarning?: (warning: WarningItem) => void | Promise<void>
}

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

function summaryLine(warning: WarningItem): string {
  if (warning.type === 'price_reach') return `价格达到 ${warning.price ?? '--'}`
  if (warning.type === 'price_rise_to') return `价格上涨至 ${warning.price ?? '--'}`
  if (warning.type === 'price_fall_to') return `价格下跌至 ${warning.price ?? '--'}`
  if (warning.type === 'price_rise_pct_over') return `价格${warning.window ?? '5m'}涨幅 ${warning.percent ?? '--'}%`
  return `价格${warning.window ?? '5m'}跌幅 ${warning.percent ?? '--'}%`
}

const WarningModal: Component<WarningModalProps> = (props) => {
  const [addVisible, setAddVisible] = createSignal(false)
  const [detail, setDetail] = createSignal<WarningItem | null>(null)

  return (
    <Modal
      title="预警"
      width={480}
      height={420}
      onClose={props.onClose}
    >
      <div class="klinecharts-pro-warning-modal">
        <div class="warning-list">
          <For each={props.warnings}>
            {(warning) => (
              <div
                class="warning-item"
                onDblClick={() => { setDetail(warning) }}
                title="双击查看详情"
              >
                <span class="warning-text">
                  {summaryLine(warning)}
                </span>
                <button
                  type="button"
                  class="warning-delete"
                  onClick={() => { props.onRemoveWarning?.(warning) }}
                  onDblClick={(e) => { e.stopPropagation() }}
                >
                  删除
                </button>
              </div>
            )}
          </For>
          <Show when={props.warnings.length === 0}>
            <div class="warning-empty">暂无预警</div>
          </Show>
          <button
            type="button"
            class="warning-add-btn"
            onClick={() => { setAddVisible(true) }}
          >
            添加
          </button>
        </div>
      </div>
      <Show when={addVisible()}>
        <WarningAddModal
          onClose={() => { setAddVisible(false) }}
          onSubmit={async (payload) => {
            await props.onAddWarning?.(payload)
          }}
        />
      </Show>
      <Show when={detail()}>
        {(w) => (
          <Modal
            title="预警详情"
            width={400}
            height={260}
            onClose={() => { setDetail(null) }}
          >
            <div class="klinecharts-pro-warning-detail">
              <dl class="warning-detail-grid">
                <Show when={!!w().symbol}>
                  <dt>标的</dt>
                  <dd>{w().symbol}</dd>
                </Show>
                <dt>类型</dt>
                <dd>{labelWarningType(w().type)}</dd>
                <Show when={w().price != null && Number.isFinite(w().price)}>
                  <dt>价格</dt>
                  <dd>{String(w().price)}</dd>
                </Show>
                <Show when={w().window != null}>
                  <dt>时间窗口</dt>
                  <dd>{labelWindow(w().window)}</dd>
                </Show>
                <Show when={w().percent != null}>
                  <dt>百分比</dt>
                  <dd>{`${w().percent}%`}</dd>
                </Show>
                <dt>频率</dt>
                <dd>{labelFrequency(w().frequency)}</dd>
                <dt>备注</dt>
                <dd>{w().remark?.trim() ? w().remark : '—'}</dd>
              </dl>
            </div>
          </Modal>
        )}
      </Show>
    </Modal>
  )
}

export default WarningModal
