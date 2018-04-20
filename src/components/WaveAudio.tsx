import { RootComponent } from '../containers/App'

// Implement THREE CACHE?

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export class WaveAudio {
  private sound: any
  private audioLoader: any
  public audio: any
  private interval: any
  private intervalId: any
  private loop: boolean
  private duration: number

  private volume: number
  public torus: THREE.Mesh

  constructor(sound, options) {
    this.sound = sound
    this.volume = options.volume
    this.interval = options.interval
    this.audioLoader = new THREE.AudioLoader()
    this.audio = new THREE.Audio(RootComponent.listener)
    this.loop = !!options.loop
    this.duration = options.duration

    if (options.color) {
      const geometry = new THREE.TorusGeometry(10, 0.1, 2, 69)
      const material = new THREE.MeshLambertMaterial({ color: options.color })
      this.torus = new THREE.Mesh(geometry, material)
    }
  }

  public playAudio = () => {
    this.audioLoader.load(this.sound, buffer => {
      this.audio.setBuffer(buffer)
      this.audio.setLoop(this.loop)
      this.audio.autoPlay = true
      this.audio.setVolume(this.volume)
      if (this.interval > -1) {
        this.intervalId = setInterval(() => {
          if (this.audio.isPlaying) {
            this.audio.stop()
          }
          this.audio.play()
        }, this.interval)
      } else {
        this.audio.play()
      }
    })
  }

  public stopAudio = () => {
    if (this.audio) {
      this.audio.stop()
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
    }
  }

  public createAnalyzer = () => {
    return new THREE.AudioAnalyser(this.audio, 32)
  }

  public updateTorus = (scale) => {
    this.torus.scale.set(scale, scale, scale)
  }

  public toggle = () => {
    // FIX THIS SO IT DOESNT LOAD EvERYTIME
    this.audioLoader.load(this.sound, buffer => {
      this.audio.setBuffer(buffer)
      this.audio.setLoop(this.loop)
      this.audio.autoPlay = true
      this.audio.setVolume(this.volume)
      this.audio.play()
    })
  }
}
