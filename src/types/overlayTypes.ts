import { DeepPartial, LineType, Overlay, OverlayCreate, OverlayEvent, OverlayTemplate, PolygonType } from "klinecharts";

export interface OverlayEventListenerParams {
  params: unknown,
  callback: (params: unknown, event?: OverlayEvent<unknown>) => void
}

export interface OverlayProperties {
  style: PolygonType
  text: string
  textColor: string
  textFont: string
  textFontSize: number
  textFontWeight: number | string
  textBackgroundColor: string
  textPaddingLeft: number
  textPaddingRight: number
  textPaddingTop: number
  textPaddingBottom: number
  lineColor: string
  lineWidth: number
  lineStyle: LineType
  lineLength: number
  lineDashedValue: number[]
  tooltip: string
  backgroundColor: string
  borderStyle: LineType
  borderColor: string
  borderWidth: number
}

export type ProOverlay = Overlay & {
  setProperties: (properties: DeepPartial<OverlayProperties>, id: string) => void
  getProperties: (id: string) => DeepPartial<OverlayProperties>
}
export type ProOverlayCreate = OverlayCreate & {
  properties?: DeepPartial<OverlayProperties>
}

export interface ProOverlayTemplate extends OverlayTemplate {
  setProperties?: (properties: DeepPartial<OverlayProperties>, id: string) => void
  getProperties?: (id: string) => DeepPartial<OverlayProperties>
}