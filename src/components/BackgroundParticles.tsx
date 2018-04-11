import * as THREE from 'three'
import {
  createCircularCanvasMaterial,
  random,
} from './Utils'

export class BackgroundParticles {
  private group: any
  private geometry: any
  private mesh: any

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
        random(-(window.innerWidth / 6), (window.innerWidth / 6)),
        random(params.rangeY[0], params.rangeY[1]),
        random(-200, 200),
      )

      this.geometry.vertices.push(particle)
    }

    this.group = new THREE.Object3D()

    this.mesh = new THREE.Points(this.geometry, material)
    this.mesh.name = 'backgroundParticles'
    this.group.add(this.mesh)

  }

  public getElement = () => this.group

  public animateParticles = () => {
    this.mesh.rotation.y += 0.0002
  }
}
