import * as THREE from 'three'
import { random } from './Utils/random'

const TWEEN = require('@tweenjs/tween.js')

export class BackgroundParticles {
  private group: any

  constructor(params?: any) {
    const material = new THREE.PointsMaterial({
      size: params.particleSize,
    })

    const geometry = new THREE.Geometry()

    for (let i = 0; i < params.count; i++) {
      const particle = new THREE.Vector3(
        random(-(window.innerWidth / 6), (window.innerWidth / 6)),
        random(params.rangeY[0], params.rangeY[1]),
        random(-50, 100)
      )

      geometry.vertices.push(particle)
    }

    this.group = new THREE.Object3D()
    this.group.add(new THREE.Points(geometry, material))
  }

  public getElement = () => this.group
}
