declare interface mouseData {
  event?: string,
  object?: any,
}

declare interface sceneDataIndex {
  name: string,
  scenes: any,
}

declare interface sceneDataAdd {
  scene: object
}

declare interface sceneDataSetCurrent {
  isTransitioning: boolean
}

declare interface sceneSetComplete {
  isTransitioning: boolean
}

declare type mouseDataConfig = mouseData
declare type sceneDataAddConfig = sceneDataAdd
declare type sceneDataIndexConfig = sceneDataIndex
declare type sceneDataSetCurrentConfig = sceneDataSetCurrent
declare type sceneDataSetCurrentCompleteConfig = sceneSetComplete
