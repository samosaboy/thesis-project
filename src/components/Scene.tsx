const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

import { store } from '../index'

export class Scene {
  private name: string
  private isPlaying: boolean
  public el: THREE.Object3D
  public _in: any
  public _out: any
  public _start: any
  public _stop: any

  constructor(props?: any) {
    this.name = props
    this.el = new THREE.Object3D()
    this.el.name = this.name
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
}
