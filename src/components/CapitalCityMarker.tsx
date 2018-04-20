import { TextGeometry } from './TextGeometry'

const THREE = require('three')

export class CapitalCityMarker {
  private city: any
  private marker: any

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
          z: params.position.z,
        },
      },
    )

    const Shape = new THREE.CircleBufferGeometry(2, 32)
    const material = new THREE.MeshStandardMaterial({ color: params.color })

    this.marker = new THREE.Mesh(Shape, material)
    this.marker.position.set(params.position.x, params.position.y - 10, params.position.z + 2)


  }

  public getCity = () => this.city

  public getMarker = () => this.marker
}
