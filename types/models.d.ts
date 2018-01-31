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

declare interface eventRippleActiveData {
  title: string,
  description: string,
  /*
   * For now we will put {any} for these
   * these two... but TODO: Fix this stuff
   */
  visual: any,
}

declare type rippleActiveConfig = rippleActiveData
declare type rippleEventActiveConfig = eventRippleActiveData
declare type HelperStateConfig = ContextualHelperData
declare type pointerPosition = pointerPositionData
