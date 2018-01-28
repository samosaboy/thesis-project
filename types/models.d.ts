declare interface ContextualHelperData {
  text: string,
  persistent?: boolean
}

declare interface rippleActiveData {
  title: string,
  description?: string
}

declare interface pointerPositionData {
  x: number,
  y: number,
}

declare type rippleActiveConfig = rippleActiveData
declare type HelperStateConfig = ContextualHelperData
declare type pointerPosition = pointerPositionData
