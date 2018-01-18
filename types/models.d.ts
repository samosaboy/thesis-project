declare interface ContextualHelperData {
  text: string
  persistent?: boolean
}

declare interface rippleActiveData {
  title: string,
  description?: string
}

declare type rippleActiveConfig = rippleActiveData
declare type HelperStateConfig = ContextualHelperData
