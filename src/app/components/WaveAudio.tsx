import * as React from 'react'
import { RootComponent } from '../containers/App'

// Implement THREE CACHE?

const THREE = require('three')

export class WaveAudio {
  private sound: any
  private audioLoader: any
  public audio: any
  private interval: any
  public intervalId: any
  private loop: boolean
  private duration: number

  private volume: number
  public torus: THREE.Mesh

  constructor(sound, options) {
    this.sound = sound
    this.volume = options.volume
    this.interval = options.interval
    this.audio = new THREE.Audio(RootComponent.listener)
    this.loop = !!options.loop
    this.duration = options.duration

    this.audioLoader = new THREE.AudioLoader(RootComponent.loadingManager)

    if (options.color) {
      const geometry = new THREE.TorusGeometry(10, 0.1, 2, 69)
      const material = new THREE.MeshLambertMaterial({ color: options.color })
      this.torus = new THREE.Mesh(geometry, material)
    }
  }

  public playAudio = () => {
    if (typeof this.intervalId === 'undefined') {
      if (!this.audioLoader) {
        this.audioLoader = new THREE.AudioLoader(RootComponent.loadingManager)
      }
      this.audioLoader.load(this.sound,
        buffer => {
          this.audio.setBuffer(buffer)
          this.audio.setLoop(this.loop)
          this.audio.autoPlay = true
          this.audio.setVolume(this.volume)
          if (this.interval > -1) {
            this.audio.play()
            this.intervalId = setInterval(() => {
              if (this.audio.isPlaying && this.audio) {
                this.audio.stop()
              }
              this.audio.play()
            }, this.interval)
          } else {
            this.audio.play()
          }
        },
        // xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded' ),
        // e => console.log(e)
      )
    }
  }

  public stopAudio = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    if (this.audio.isPlaying && this.audio
      || !this.audio.isPlaying && this.audio
      || this.audio) {
      this.audio.stop()
    }
  }

  public createAnalyzer = () => {
    return new THREE.AudioAnalyser(this.audio, 32)
  }
}
