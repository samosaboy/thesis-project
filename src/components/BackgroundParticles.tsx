import * as THREE from 'three'
import {
  createAnimation,
  createCircularCanvasMaterial,
  random,
} from './Utils'

const TWEEN = require('@tweenjs/tween.js')

export class BackgroundParticles {
  private group: any
  private geometry: any
  private mesh: any
  private cache: any

  private createAnimation: any

  constructor(params?: any) {
    const material = new THREE.PointsMaterial({
      map: createCircularCanvasMaterial('#f4f3ff', 512),
      size: params.particleSize,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    })

    this.geometry = new THREE.Geometry()

    for (let i = 0; i < params.count; i++) {
      const particle = new THREE.Vector3(
        random(-(window.innerWidth / 3), (window.innerWidth / 3)),
        random(params.rangeY[0], params.rangeY[1]),
        random(-200, 200),
      )

      this.geometry.vertices.push(particle)
    }

    this.group = new THREE.Object3D()

    this.mesh = new THREE.Points(this.geometry, material)
    this.group.add(this.mesh)

    this.cache = {
      y: 100,
      opacity: 0
    }

    this.createAnimation = new createAnimation(this.mesh, {
      y: 100,
      opacity: 0
    })
  }

  private update = () => {
    this.mesh.position.y = this.cache.y
    this.mesh.material.opacity = this.cache.opacity
  }

  public getElement = () => this.group

  public animateParticles = () => {
    this.mesh.rotation.y += 0.0005
  }

  public in = () => {
    this.createAnimation.in({
      y: 0,
      opacity: 1
    }, 3000)
  }

  public out = () => {
    this.createAnimation.out(1000)
  }
}
