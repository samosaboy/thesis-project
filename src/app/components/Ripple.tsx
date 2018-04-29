import { Wave } from './Wave'
import { WaveAudio } from './WaveAudio'

export class Ripple {
  private wave: any
  private audio: any

  constructor(params) {
    this.wave = new Wave({
      color: params.color,
      linewidth: params.linewidth,
      radius: params.radius,
      resolution: params.resolution,
      waveNumber: params.waveNumber,
      tetaOffset: params.tetaOffset,
      waveLength: params.waveLength,
      waveType: params.waveType,
      waveCount: params.waveCount,
      waveScale: params.waveScale,
    })

    if (params.position) {
      this.wave.mesh.position.set(params.position.x, params.position.y, params.position.z)
    }

    this.audio = new WaveAudio(params.soundUrl, {
      volume: params.volume,
      interval: params.interval,
      color: params.color,
    })
  }

  public clickableRegion = () => this.wave.clickableArea

  public waveMesh = () => this.wave.mesh

  public waveAudio = () => this.audio.audio

  public analyzer = () => this.audio.createAnalyzer()

  public in = (dur?: number) => this.wave.in(dur)

  public out = () => this.wave.out()

  public play = () => this.audio.playAudio()

  public stop = () => this.audio.stopAudio()

  public update = (delta) => this.wave.update(delta)
}
