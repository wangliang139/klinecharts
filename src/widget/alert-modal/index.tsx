import { Component, createSignal, For, Show } from 'solid-js'

import { Modal } from '../../component'
import { AlertItem, AlertItemInput } from '../../types/types'
import AlertAddModal from '../alert-add-modal'
import { AlertDetailFields } from './alert-detail-fields'

export interface AlertModalProps {
  alerts: AlertItem[]
  onClose: () => void
  onAddAlert?: (alert: AlertItemInput) => void | Promise<void>
  onRemoveAlert?: (alert: AlertItem) => void | Promise<void>
}

function summaryLine(alertItem: AlertItem): string {
  if (alertItem.type === 'price_reach') return `价格达到 ${alertItem.price ?? '--'}`
  if (alertItem.type === 'price_rise_to') return `价格上涨至 ${alertItem.price ?? '--'}`
  if (alertItem.type === 'price_fall_to') return `价格下跌至 ${alertItem.price ?? '--'}`
  if (alertItem.type === 'price_rise_pct_over') return `价格${alertItem.window ?? '5m'}涨幅 ${alertItem.percent ?? '--'}%`
  return `价格${alertItem.window ?? '5m'}跌幅 ${alertItem.percent ?? '--'}%`
}

const AlertModal: Component<AlertModalProps> = (props) => {
  const [addVisible, setAddVisible] = createSignal(false)
  const [detail, setDetail] = createSignal<AlertItem | null>(null)

  return (
    <Modal
      title="预警"
      width={480}
      onClose={props.onClose}
    >
      <div class="klinecharts-pro-alert-modal">
        <div class="alert-list">
          <For each={props.alerts}>
            {(alertItem) => (
              <div
                class="alert-item"
                onDblClick={() => { setDetail(alertItem) }}
                title="双击查看详情"
              >
                <span class="alert-text">
                  {summaryLine(alertItem)}
                </span>
                <button
                  type="button"
                  class="alert-delete"
                  onClick={() => { props.onRemoveAlert?.(alertItem) }}
                  onDblClick={(e) => { e.stopPropagation() }}
                >
                  删除
                </button>
              </div>
            )}
          </For>
          <Show when={props.alerts.length === 0}>
            <div class="alert-empty">暂无预警</div>
          </Show>
        </div>
        <div class="alert-add-btn-container">
          <button
            type="button"
            class="alert-add-btn"
            onClick={() => { setAddVisible(true) }}
          >
            添加
          </button>
        </div>
      </div>
      <Show when={addVisible()}>
        <AlertAddModal
          onClose={() => { setAddVisible(false) }}
          onSubmit={async (payload) => {
            await props.onAddAlert?.(payload)
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
            <div class="klinecharts-pro-alert-detail">
              <AlertDetailFields alert={w()} />
            </div>
          </Modal>
        )}
      </Show>
    </Modal>
  )
}

export default AlertModal
