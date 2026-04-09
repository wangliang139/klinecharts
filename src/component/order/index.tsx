import { Component } from "solid-js";

import type { HisOrder } from "../../types/types";

export interface HisOrderHoverProps {
  order: HisOrder;
  formattedTime: string;
  anchorX?: number | null;
  anchorY?: number | null;
  /** 若传入，浮层限制在该元素可视矩形内（与 position:fixed 一致，使用 getBoundingClientRect） */
  clipElement?: HTMLElement | null;
}

const rowStyle = { display: "flex", "justify-content": "space-between", gap: "8px" } as const;
const valueStyle = { "text-align": "right" } as const;

const HisOrderHover: Component<HisOrderHoverProps> = (props) => {
  const isBuy = () => props.order.isBuy;
  const panelWidth = 220;
  const panelHeight = 196;
  const margin = 12;
  const offset = 12;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1024;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 768;
  const clip = props.clipElement?.getBoundingClientRect();
  const boxLeft = clip?.left ?? 0;
  const boxTop = clip?.top ?? 0;
  const boxRight = clip?.right ?? viewportW;
  const boxBottom = clip?.bottom ?? viewportH;
  const hasAnchor = typeof props.anchorX === "number" && typeof props.anchorY === "number";
  const anchorX = hasAnchor ? (props.anchorX as number) : boxRight - panelWidth - 16;
  const anchorY = hasAnchor ? (props.anchorY as number) : boxTop + 84;

  const rightSpace = boxRight - anchorX - margin;
  const leftSpace = anchorX - boxLeft - margin;
  const bottomSpace = boxBottom - anchorY - margin;
  const topSpace = anchorY - boxTop - margin;

  const placeRight = rightSpace >= panelWidth + offset || rightSpace >= leftSpace;
  const placeBottom = bottomSpace >= panelHeight + offset || bottomSpace >= topSpace;

  const rawLeft = placeRight ? anchorX + offset : anchorX - panelWidth - offset;
  const rawTop = placeBottom ? anchorY + offset : anchorY - panelHeight - offset;

  const minL = boxLeft + margin;
  const maxL = boxRight - panelWidth - margin;
  const minT = boxTop + margin;
  const maxT = boxBottom - panelHeight - margin;
  const left = Math.min(Math.max(minL, rawLeft), Math.max(minL, maxL));
  const top = Math.min(Math.max(minT, rawTop), Math.max(minT, maxT));
  return (
    <div class={`klinecharts-pro-his-order-hover ${isBuy() ? "is-buy" : "is-sell"}`} style={{ left: `${left}px`, top: `${top}px` }}>
      <div class={`klinecharts-pro-his-order-hover-title ${isBuy() ? "is-buy" : "is-sell"}`}>
        {isBuy() ? "买入" : "卖出"}
      </div>
      <div style={rowStyle}><strong>订单ID：</strong><span style={valueStyle}>{String(props.order.orderId ?? props.order.id ?? "-")}</span></div>
      <div style={rowStyle}><strong>价格：</strong><span style={valueStyle}>{String(props.order.price)}</span></div>
      <div style={rowStyle}><strong>数量：</strong><span style={valueStyle}>{String(props.order.size)}</span></div>
      <div style={rowStyle}><strong>手续费：</strong><span style={valueStyle}>{String(props.order.fee ?? "-")}</span></div>
      <div style={rowStyle}><strong>已实现盈亏：</strong><span style={valueStyle}>{String(props.order.pnl ?? "-")}</span></div>
      <div style={rowStyle}><strong>成交时间：</strong><span style={valueStyle}>{props.formattedTime}</span></div>
    </div>
  );
};

export default HisOrderHover;
