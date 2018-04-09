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
  name: string
}

declare type mouseDataConfig = mouseData
declare type sceneDataAddConfig = sceneDataAdd
declare type sceneDataIndexConfig = sceneDataIndex
declare type sceneDataSetCurrentConfig = sceneDataSetCurrent
