const THREE = require('three')

export class Scene {
  private name: string
  public isPlaying: boolean
  public el: THREE.Object3D
  public _in: any
  public _out: any
  public _start: any
  public _stop: any
  public _update: any

  constructor(name: string) {
    this.el = new THREE.Object3D()
    this.el.name = name
    this.isPlaying = false
  }

  public add = (object) => {
    this.el.add(object)
  }

  public in = () => {
    this._in()
  }

  public out = () => {
    this._out()
  }

  public start = () => {
    if (this.isPlaying) {
      return
    }
    this._start()
    this.isPlaying = true
  }

  public stop = () => {
    if (!this.isPlaying) {
      return
    }

    this._stop()
    this.isPlaying = false
  }

  public update = () => {
    this._update()
  }

  public onIn = (callback) => {
    this._in = callback
  }

  public onOut = (callback) => {
    this._out = callback
  }

  public onStart = (callback) => {
    this._start = callback
  }

  public onStop = (callback) => {
    this._stop = callback
  }

  public onUpdate = (callback) => {
    this._update = callback
  }
}
