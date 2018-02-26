declare interface helperData {
  text: string,
  persistent?: boolean
}

declare interface rippleActiveData {
  title: string,
}

declare interface pointerPositionData {
  x: number,
  y: number,
}

// This interface defines the types when a user clicks an event
declare interface eventActiveData {
  // Until its final imma put any
  data: any
}


// Declare Type using interface for our reducers
declare type rippleActiveConfig = rippleActiveData
declare type helperConfig = helperData
declare type pointerPositionConfig = pointerPositionData
declare type eventActiveConfig = eventActiveData
