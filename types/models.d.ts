declare interface mouseData {
  event?: string,
  object?: any
}

declare interface sceneDataIndex {
  scenes: any,
}

declare interface sceneDataAdd {
  scene: object
}

declare interface sceneDataDelete {
  name: string
}

declare type mouseDataConfig = mouseData
declare type sceneDataAddConfig = sceneDataAdd
declare type sceneDataIndexConfig = sceneDataIndex
declare type sceneDataDeleteConfig = sceneDataDelete
