import { DummyOrderController, KLineChartPro } from "@wangliang139/klinecharts-pro";

import { createApiDatafeed } from "./apiDatafeed";
import { createApolloClient } from "./apollo";

import "./main.css";

const apolloClient = createApolloClient();
const datafeed = createApiDatafeed(apolloClient);

const root = document.getElementById("app");
if (!root) {
  throw new Error("#app 容器不存在");
}

root.innerHTML = `
  <div class="dev-toolbar">
    <button id="btn-create-order" type="button">创建测试订单线</button>
    <button id="btn-clear-orders" type="button">清空测试订单</button>
    <span class="dev-hint">提示：创建后可拖动线条改价；点“Size”改单；点右侧 X 平仓</span>
  </div>
  <div id="chart" class="chart-wrap"></div>
`;

const orderController = new DummyOrderController("dev_order_controller");

const chart = new KLineChartPro({
  container: "chart",
  symbol: {
    ticker: "BTC/USDT:FUTURE",
    name: "BTC/USDT:FUTURE",
    shortName: "BTC/USDT:FUTURE",
    market: "binance",
    exchange: "binance",
    pricePrecision: 2,
    volumePrecision: 2,
    priceCurrency: "USDT",
    type: "crypto",
  },
  period: { span: 1, type: "minute", text: "1m" },
  periods: [
    { span: 1, type: "minute", text: "1m" },
    { span: 5, type: "minute", text: "5m" },
    { span: 15, type: "minute", text: "15m" },
    { span: 1, type: "hour", text: "1h" },
    { span: 4, type: "hour", text: "4h" },
    { span: 1, type: "day", text: "1d" },
  ],
  datafeed,
  orderController,
  theme: "light",
  locale: "zh-CN",
  drawingBarVisible: false,
  orderPanelVisible: true,
});

chart.setStyles({
  candle: {
    tooltip: {
      title: { show: false, template: "{ticker} · {period}" },
    },
  },
});

setTimeout(() => {
  console.log("style:", chart.getInstanceApi()?.getStyles());
  console.log("overlay:", chart.getInstanceApi()?.getOverlays());
  const api = chart.getInstanceApi();
  const list = api?.getDataList() ?? [];
  const last = list.at(-1);
  const close = typeof last?.close === "number" && Number.isFinite(last.close) ? last.close : 95000;
  chart.setPositions([
    { side: "long", avgPrice: close-100, size: 10 },
    { side: "short", avgPrice: close+100, size: 10 },
  ]);
  chart.setLiqPrice(70000);
  chart.setOpenOrders([
    { side: "long", isBuy: true, price: close - 200, size: 10 },
    { side: "short", isBuy: false, price: close + 200, size: 10 },
    { side: "short", isBuy: false, size: 10 , orderType: "market"},
  ]);
}, 1500);

function bindOrderResourceDemo() {
  const btnCreate = document.getElementById("btn-create-order");
  const btnClear = document.getElementById("btn-clear-orders");

  if (!(btnCreate instanceof HTMLButtonElement) || !(btnClear instanceof HTMLButtonElement)) {
    console.warn("[dev] toolbar buttons not found");
    return;
  }

  btnClear.addEventListener("click", () => {
    localStorage.removeItem("dev_order_controller");
    console.log("[dev] cleared DummyOrderController storage: dev_order_controller");
  });

  btnCreate.addEventListener("click", async () => {
    const api = chart.getInstanceApi();
    if (!api) return;

    const list = api.getDataList() ?? [];
    const last = list.at(-1);
    const close = typeof last?.close === "number" && Number.isFinite(last.close) ? last.close : 95000;

    const order = await orderController.openOrder("buy", 1, close, close - 200, close + 200);
    if (!order) {
      console.warn("[dev] openOrder returned null");
      return;
    }

    const line = api.createOrderLine();
    if (!line) {
      console.warn("[dev] createOrderLine returned null");
      return;
    }

    const syncLine = async () => {
      const latest = await orderController.retrieveOrder(order.orderId);
      if (!latest) return;
      line
        .setText(`${latest.action.toUpperCase()} #${latest.orderId}`)
        .setQuantity(String(latest.lotSize))
        .setPrice(latest.entryPoint)
        .setTooltip("拖动可改价")
        .setModifyTooltip("点击改单");
      console.log("[dev] order:", latest);
    };

    line.onMoveEnd({ orderId: order.orderId }, async (_params, event) => {
      const v = (event as any)?.overlay?.points?.[0]?.value;
      const entrypoint = typeof v === "number" && Number.isFinite(v) ? v : undefined;
      if (entrypoint === undefined) return;
      await orderController.modifyOrder({ id: order.orderId, entrypoint });
      await syncLine();
    });

    line.onModify({ orderId: order.orderId }, async () => {
      const latest = await orderController.retrieveOrder(order.orderId);
      if (!latest) return;
      await orderController.modifyOrder({ id: order.orderId, lotsize: latest.lotSize + 1 });
      await syncLine();
    });

    line.onCancel({ orderId: order.orderId }, async () => {
      await orderController.closeOrder(order.orderId);
      console.log("[dev] closeOrder:", order.orderId);
      // 可选：如果想把线也移除，可以在这里调用 api.removeOverlay({ id: line.id })
    });

    await syncLine();
  });
}

bindOrderResourceDemo();

window.addEventListener("resize", () => {
  chart.resize();
});
