import * as THREE from 'three'
import {
  createAnimation,
  createCircularCanvasMaterial,
  random,
} from './Utils'

export class BackgroundParticles {
  private group: any
  private geometry: any
  private mesh: any
  private devicePixelRatio: number

  private createAnimation: any

  constructor(params?: any) {
    this.devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
    const material = new THREE.PointsMaterial({
      map: createCircularCanvasMaterial('#8e8d94', 512),
      size: params.particleSize,
      transparent: true,
      opacity: 0.5,
    })

    this.geometry = new THREE.Geometry()

    for (let i = 0; i < params.count; i++) {
      const particle = new THREE.Vector3(
        random(-(window.innerWidth * this.devicePixelRatio), (window.innerWidth * this.devicePixelRatio)),
        random(-40, (window.innerHeight / 6)),
        random(-300, 300),
      )

      this.geometry.vertices.push(particle)
    }

    this.group = new THREE.Object3D()

    this.mesh = new THREE.Points(this.geometry, material)
    this.group.add(this.mesh)

    this.createAnimation = new createAnimation(this.mesh, {
      y: 100,
      opacity: 0
    })
  }

  public getElement = () => this.group

  public animateParticles = () => {
    this.mesh.rotation.y += 0.0005
  }

  public in = () => {
    this.createAnimation.in({
      y: 0,
      opacity: 1
    }, 1000)
  }

  public out = () => {
    this.createAnimation.out(1000)
  }
}
