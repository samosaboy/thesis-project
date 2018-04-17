const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

import * as  ImprovedNoise from './Utils/ImprovedNoise.js'

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
  private waveGeom: any
  private waveArray: Array<any>
  private colorArray: Array<any>

  private noisePos: number

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

    // const waveGeom = new THREE.Geometry()
    // const waveMaterial = new THREE.LineBasicMaterial({
    //   color: options.color,
    //   linewidth: options.linewidth,
    // })
    // this.mesh = new THREE.Line(waveGeom, waveMaterial)

    this.mesh = new THREE.Object3D()

    this.noisePos = 0.005

    const shape = new THREE.Shape()
    shape.absarc(0, 0, 1, 0, Math.PI * 2, false)
    this.waveGeom = shape.createPointsGeometry(100)
    this.waveGeom.dynamic = true
    const waveMaterial = new THREE.LineBasicMaterial({
      color: options.color,
      linewidth: 1,
    })

    this.colorArray = []
    this.waveArray = []
    for (let y = 0; y < 10; y++) {
      const waveMesh = new THREE.Line(this.waveGeom, waveMaterial)
      waveMesh.scale.set((y * 0.1), (y * 0.1))
      this.mesh.add(waveMesh)
      this.waveArray.push(waveMesh)
    }
  }

  public update = (audioData?: any): any => {

    this.noisePos += 0.1
    const perlin = ImprovedNoise().noise
    const n = Math.abs(perlin(this.noisePos, 0, 0))
    this.colorArray.push(n)

    for (let y = 0; y < 10; y++) {
      this.waveArray[y].scale.set(
        this.radius * 2 + this.colorArray[y] * audioData,
        this.radius * 2 + this.colorArray[y] * audioData
      )
    }
    const scaleValue = 0.01
    // new TWEEN.Tween(this.mesh.scale)
    //   .to({
    //     x: this.radius * 2 + (scaleValue * audioData),
    //     y: this.radius * 2 + (scaleValue * audioData),
    //     z: this.radius * 2 + (scaleValue * audioData),
    //   }, 100)
    //   .easing(TWEEN.Easing.Circular.InOut)
    //   .start()
    // // this.mesh.scale.set(0.5 * audioData, 0.5 * audioData, 0.5 * audioData)
    //
    new TWEEN.Tween(this.mesh.rotation)
      .to({
        z: scaleValue * audioData,
      }, 100)
      .easing(TWEEN.Easing.Circular.InOut)
      .start()

    const newVertices = []

    for (let i = 0; i <= this.resolution; i++) {
      {
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
      this.waveGeom.vertices = newVertices
      this.waveGeom.verticesNeedUpdate = true
    }
  }
}
