import { TextGeometry } from './TextGeometry'
import { createAnimation } from './Utils'

const THREE = require('three')

export class CapitalCityMarker {
  private city: any
  private marker: any
  private createAnimation: any
  private position: any

  constructor(params) {
    this.city = new TextGeometry(
      params.city, {
        align: params.align,
        size: params.size,
        lineSpacing: params.lineSpacing,
        font: params.font,
        style: params.style,
        color: params.color,
        position: {
          x: params.position.x,
          y: params.position.y,
          z: params.position.z + 25,
        },
      },
    )

    this.position = params.position

    const Shape = new THREE.CircleBufferGeometry(2, 32)
    const material = new THREE.MeshStandardMaterial({ color: params.color })

    this.marker = new THREE.Mesh(Shape, material)
    this.marker.visible = false
    this.marker.position.set(this.position.x, this.position.y - 10, this.position.z + 2)

    this.createAnimation = new createAnimation(this.marker, {
      y: this.position.y < 0 / 2 ? -200 : 200,
      x: this.position.x || 0,
      z: this.position.z || 0,
      opacity: 0,
    })
  }

  public getCity = () => this.city

  public getMarker = () => this.marker

  public in = () => {
    this.createAnimation.in({
      y: this.position.y -10,
      x: this.position.x,
      z: this.position.z + 2,
      opacity: 1
    }, 1000)
  }

  public out = () => {
    this.createAnimation.out(500)
  }
}
