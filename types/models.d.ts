declare interface sceneDataAdd {
  scene: object
}

declare interface sceneDataSetCurrent {
  isTransitioning: boolean
}

declare interface sceneSetComplete {
  isTransitioning: boolean
}

declare type sceneDataAddConfig = sceneDataAdd
declare type sceneDataSetCurrentConfig = sceneDataSetCurrent
declare type sceneDataSetCurrentCompleteConfig = sceneSetComplete
