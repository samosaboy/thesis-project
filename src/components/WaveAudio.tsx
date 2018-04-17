import { RootComponent } from '../containers/App'

// Implement THREE CACHE?

const THREE = require('three')

export class WaveAudio {
  private sound: any
  private audioLoader: any
  public audio: any
  private interval: any
  private intervalId: any

  private volume: number
  public torus: THREE.Mesh

  constructor(sound, options) {
    this.sound = sound
    this.volume = options.volume
    this.interval = options.interval
    this.audioLoader = new THREE.AudioLoader()
    this.audio = new THREE.Audio(RootComponent.listener)

    const geometry = new THREE.TorusGeometry(10, 0.1, 2, 69)
    const material = new THREE.MeshLambertMaterial({ color: options.color })
    this.torus = new THREE.Mesh(geometry, material)
  }

  public playAudio = () => {
    this.audioLoader.load(this.sound, buffer => {
      this.audio.setBuffer(buffer)
      this.audio.setLoop(false)
      this.audio.setVolume(this.volume)
      this.intervalId = setInterval(() => {
        this.audio.play()
      }, this.interval)
    })
  }

  public stopAudio = () => {
    if (this.audio.isPlaying) {
      this.audio.stop()
    }
    clearInterval(this.intervalId)
  }

  public createAnalyzer = () => {
    return new THREE.AudioAnalyser(this.audio, 32)
  }

  public updateTorus = (scale) => {
    this.torus.scale.set(scale, scale, scale)
  }
}
