/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { Coordinate, OverlayEvent, OverlayTemplate, TextStyle } from "klinecharts";

import { formatWesternGrouped } from "../../helpers";
import type { HisOrder } from "../../types/types";

const BUY_COLOR = "#2ebd85";
const SELL_COLOR = "#f6465d";
const MARK_RADIUS = 6;
const MARK_OFFSET = 14;
const STACK_GAP = 14;
const HOVER_GAP = 10;
const LINE_HEIGHT = 18;

const hoveredOverlayIds = new Set<string>();

const markerTextStyle: TextStyle = {
  style: "fill",
  size: 8,
  family: "Arial, sans-serif",
  weight: "bold",
  color: "#ffffff",
  backgroundColor: "transparent",
  borderColor: "transparent",
  borderStyle: "solid",
  borderSize: 0,
  borderDashedValue: [],
  borderRadius: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
};

const hoverTextStyle = (color: string): TextStyle => ({
  style: "stroke_fill",
  size: 11,
  family: "Arial, sans-serif",
  weight: "normal",
  color,
  backgroundColor: "#ffffff",
  borderColor: color,
  borderStyle: "solid",
  borderSize: 1,
  borderDashedValue: [],
  borderRadius: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 3,
  paddingBottom: 3,
});

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

const historicalOrderMark = (): OverlayTemplate => ({
  name: "historicalOrderMark",
  mode: "normal",
  totalStep: 1,
  lock: true,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  createPointFigures: ({ chart, coordinates, overlay }) => {
    const point = overlay.points[0];
    const ext = overlay.extendData as (HisOrder & { stackIndex?: number }) | undefined;
    if (!point || !ext || !Number.isFinite(point.timestamp) || typeof ext.isBuy !== "boolean") {
      return [];
    }
    const bar = chart.getDataList().find((item) => item.timestamp === point.timestamp);
    if (!bar || !Number.isFinite(bar.high) || !Number.isFinite(bar.low)) {
      return [];
    }
    const color = ext.isBuy ? BUY_COLOR : SELL_COLOR;
    const markText = ext.isBuy ? "B" : "S";
    const x = coordinates[0].x;
    const highY =
      (chart.convertToPixel({ timestamp: point.timestamp, value: bar.high }) as Partial<Coordinate>).y ??
      coordinates[0].y;
    const lowY =
      (chart.convertToPixel({ timestamp: point.timestamp, value: bar.low }) as Partial<Coordinate>).y ??
      coordinates[0].y;
    const stackIndex = Math.max(0, ext.stackIndex ?? 0);
    const y = ext.isBuy
      ? lowY + MARK_OFFSET + stackIndex * STACK_GAP
      : highY - MARK_OFFSET - stackIndex * STACK_GAP;

    const figures: any[] = [
      {
        key: "his-order-dot",
        type: "circle",
        attrs: { x, y: y - 0.5, r: MARK_RADIUS },
        styles: { color },
        ignoreEvent: false,
      },
      {
        key: "his-order-char",
        type: "text",
        attrs: { x, y, text: markText, align: "center", baseline: "middle" },
        styles: markerTextStyle,
        ignoreEvent: true,
      },
    ];

    if (overlay.id && hoveredOverlayIds.has(overlay.id)) {
      const symbol = chart.getSymbol();
      const pricePrecision = symbol?.pricePrecision ?? 2;
      const volumePrecision = symbol?.volumePrecision ?? 4;
      const lines = [
        `${markText} ${ext.isBuy ? "BUY" : "SELL"}  #${ext.orderId ?? ext.id ?? "-"}`,
        `Px ${formatWesternGrouped(ext.price, pricePrecision)}  Qty ${formatWesternGrouped(ext.size, volumePrecision)}`,
        `Fee ${formatWesternGrouped(ext.fee ?? 0, pricePrecision)}  PnL ${formatWesternGrouped(ext.pnl ?? 0, pricePrecision)}`,
        `${formatTime(ext.timestamp)}`,
      ];
      const baseY = ext.isBuy ? y + HOVER_GAP : y - HOVER_GAP;
      const direction = ext.isBuy ? 1 : -1;
      lines.forEach((line, idx) => {
        figures.push({
          key: `his-order-hover-${idx}`,
          type: "text",
          attrs: {
            x: x + 12,
            y: baseY + direction * idx * LINE_HEIGHT,
            text: line,
            align: "left",
            baseline: ext.isBuy ? "top" : "bottom",
          },
          styles: hoverTextStyle(color),
          ignoreEvent: true,
        });
      });
    }

    return figures;
  },
  onMouseEnter: (event: OverlayEvent<unknown>) => {
    if (event.overlay.id) hoveredOverlayIds.add(event.overlay.id);
    return false;
  },
  onMouseLeave: (event: OverlayEvent<unknown>) => {
    if (event.overlay.id) hoveredOverlayIds.delete(event.overlay.id);
    return false;
  },
  onPressedMoveStart: () => false,
  onPressedMoving: () => false,
  onPressedMoveEnd: () => false,
  onSelected: (event: OverlayEvent<unknown>) => {
    if (event.preventDefault) event.preventDefault();
    event.overlay.mode = "normal";
    return false;
  },
  onRightClick: (event: OverlayEvent<unknown>) => {
    if (event.preventDefault) event.preventDefault();
    return false;
  },
});

export default historicalOrderMark;
