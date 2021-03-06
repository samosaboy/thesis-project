import { createAnimation } from './Utils'
import * as  ImprovedNoise from './Utils/ImprovedNoise.js'

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
  private color: any

  private waveType: string

  public mesh: THREE.Mesh
  private waveGeom: any
  private waveArray: Array<any>
  private colorArray: Array<any>

  private noisePos: number

  private waveCount: number
  private waveScale: number

  private createAnimation: any

  public clickableArea: any

  constructor(options) {
    this.resolution = options.resolution
    this.radius = options.radius
    this.waveNumber = options.waveNumber
    this.tetaOffset = options.tetaOffset
    this.waveLength = options.waveLength
    this.waveType = options.waveType
    this.waveCount = options.waveCount
    this.waveScale = options.waveScale
    this.color = options.color

    this.count = 0
    this.speed = 0.05
    this.waveHeight = 0.001 * this.radius

    this.mesh = new THREE.Object3D()
    this.mesh.visible = false
    this.mesh.position.setZ(5)

    this.createAnimation = new createAnimation(this.mesh, {
      z: 300,
    })

    const outlineObj = new THREE.CircleGeometry(this.radius * 2, 928)
    outlineObj.vertices.shift()
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0xE0E0E0,
    })
    this.clickableArea = new THREE.Line(outlineObj, outlineMaterial)
    this.mesh.add(this.clickableArea)

    const clickableObj = new THREE.SphereBufferGeometry(this.radius * 2.2, 16, 16)
    const clickableMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      depthWrite: false,
      opacity: 0
    })

    const clickableMesh = new THREE.Mesh(clickableObj, clickableMaterial)
    this.clickableArea.add(clickableMesh)

    this.noisePos = 0.005

    const shape = new THREE.Shape()
    shape.absarc(0, 0, 1, 0, Math.PI * 2, false)
    this.waveGeom = shape.createPointsGeometry(100)
    this.waveGeom.dynamic = true
    const waveMaterial = new THREE.LineBasicMaterial({
      color: options.color,
      linewidth: 1,
      transparent: true,
      blending: THREE.NormalBlending,
    })

    this.colorArray = []
    this.waveArray = []
    for (let y = 0; y < this.waveCount; y++) {
      const waveMesh = new THREE.Line(this.waveGeom, waveMaterial)
      waveMesh.scale.set((y * this.waveScale), (y * this.waveScale))
      this.mesh.add(waveMesh)
      this.waveArray.push(waveMesh)
    }
  }

  public update = (audioData?: any): any => {
    this.noisePos += 0.01
    const perlin = ImprovedNoise().noise
    const n = Math.abs(perlin(this.noisePos, 0, 0))
    this.colorArray.push(n)

    for (let y = 0; y < this.waveCount; y++) {
      this.waveArray[y].scale.set(
        this.radius * 2 + this.colorArray[y] * audioData,
        this.radius * 2 + this.colorArray[y] * audioData,
        this.radius * 2 + this.colorArray[y] * audioData,
      )
      this.waveArray[y].material.opacity = this.colorArray[y] > 1 ? this.colorArray[y] : 0.2
    }

    this.clickableArea.scale.set(
      this.radius + 0.01 * audioData,
      this.radius + 0.01 * audioData,
      this.radius + 0.01 * audioData,
    )
    if (audioData > 0.5) {
      this.clickableArea.material.color.set(this.color)
    } else {
      this.clickableArea.material.color.set(0xE0E0E0)
    }

    const scaleValue = 0.01
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

  public in = (dur: number) => {
    this.createAnimation.in({
      z: 25,
    }, dur)
  }

  public out = () => {
    this.createAnimation.out(1000)
  }
}
