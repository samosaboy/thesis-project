const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export class Wave {
  private count: number
  private speed: number
  private radius: number
  private resolution: number
  private waveNumber: number
  private tetaOffset: number
  private waveLength: number
  private waveHeight: number

  private waveType: string

  public mesh: THREE.Mesh

  constructor(options) {
    this.resolution = options.resolution
    this.radius = options.radius
    this.waveNumber = options.waveNumber
    this.tetaOffset = options.tetaOffset
    this.waveLength = options.waveLength
    this.waveType = options.waveType

    this.count = 0
    this.speed = 0.05
    this.waveHeight = 0.001 * this.radius

    const waveGeom = new THREE.Geometry()
    const waveMaterial = new THREE.LineBasicMaterial({
      color: options.color,
      linewidth: options.linewidth,
    })
    this.mesh = new THREE.Line(waveGeom, waveMaterial)
  }

  public update = (audioData?: any): any => {
    const scaleValue = 0.01
    new TWEEN.Tween(this.mesh.scale)
      .to({
        x: this.radius * 2 + (scaleValue * audioData),
        y: this.radius * 2 + (scaleValue * audioData),
        z: this.radius * 2 + (scaleValue * audioData),
      }, 100)
      .easing(TWEEN.Easing.Circular.InOut)
      .start()
    // this.mesh.scale.set(0.5 * audioData, 0.5 * audioData, 0.5 * audioData)

    new TWEEN.Tween(this.mesh.rotation)
      .to({
        z: scaleValue * audioData,
      }, 100)
      .easing(TWEEN.Easing.Circular.InOut)
      .start()

    // this.mesh.rotateZ(scaleValue * audioData)
    const newVertices = []

    for (let i = 0; i <= this.resolution; i++) {
      const teta = Math.PI / 180 * (i + this.tetaOffset)
      let deltaRadius = 0

      if (i < this.waveLength * this.resolution || i === this.resolution) {
        const smoothAmount = 0.14
        let smoothPercent = 1

        if (i < this.waveLength * this.resolution * smoothAmount) {
          smoothPercent = i / (this.waveLength * this.resolution * smoothAmount)
        } else if (i > this.waveLength * this.resolution * (1 - smoothAmount) && i <= this.waveLength * this.resolution) {
          smoothPercent = (this.waveLength * this.resolution - i) / (this.waveLength * this.resolution * smoothAmount)
        } else if (i == this.resolution) {
          smoothPercent = 0
        }

        if (this.waveType === 'normal') {
          deltaRadius = this.waveHeight * smoothPercent * Math.cos((teta + this.count) * this.waveNumber) * audioData * 5
        } else if (this.waveType === 'crazy') {
          deltaRadius = this.waveHeight * smoothPercent * Math.sin((teta + this.count) * this.waveNumber) * audioData * 5
        }
      }

      const x = (this.radius + deltaRadius) * Math.cos(teta + this.count)
      const y = (this.radius + deltaRadius) * Math.sin(teta + this.count)
      const z = 0

      newVertices.push(new THREE.Vector3(x, y, z))
    }
    (this.mesh as any).geometry.vertices = newVertices
  }
}
