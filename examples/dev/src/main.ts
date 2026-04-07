import { KLineChartPro } from '@wangliang139/klinecharts-pro'

import { createApiDatafeed } from './apiDatafeed'
import { createApolloClient } from './apollo'

import './main.css'

const defaultExchange = import.meta.env.VITE_KLINE_EXCHANGE ?? 'binance'
const defaultTicker = import.meta.env.VITE_KLINE_SYMBOL ?? 'BTC/USDT:FUTURE'
const apolloClient = createApolloClient()
const datafeed = createApiDatafeed(apolloClient)

const root = document.getElementById('app')
if (!root) {
  throw new Error('#app 容器不存在')
}

root.innerHTML = '<div id="chart" class="chart-wrap"></div>'

const chart = new KLineChartPro({
  container: 'chart',
  symbol: {
    exchange: defaultExchange,
    ticker: defaultTicker,
    name: defaultTicker,
    shortName: defaultTicker,
    market: defaultExchange,
    pricePrecision: 2,
    volumePrecision: 2,
    priceCurrency: 'USDT',
    type: 'crypto',
  },
  period: { span: 1, type: 'minute', text: '1m' },
  periods: [
    { span: 1, type: 'minute', text: '1m' },
    { span: 5, type: 'minute', text: '5m' },
    { span: 15, type: 'minute', text: '15m' },
    { span: 1, type: 'hour', text: '1h' },
    { span: 2, type: 'hour', text: '2h' },
    { span: 4, type: 'hour', text: '4h' },
  ],
  datafeed,
  theme: 'dark',
  locale: 'zh-CN',
  drawingBarVisible: false,
})

chart.setStyles({
  candle: {
    tooltip: {
      title: {show: false, template: '{ticker} · {period}'},
    },
  },
})

setTimeout(() => {
  console.log(chart.getInstanceApi()?.getStyles())
}, 1000)

window.addEventListener('resize', () => {
  chart.resize()
})
