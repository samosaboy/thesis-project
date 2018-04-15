import {
  createAnimation,
  TextureAnimator,
} from './Utils'

const THREE = require('three')

export class Icon {
  private sprite: any
  private map: any
  private createAnimation: any
  private position: any

  constructor(path, params) {
    const iconTexture = new THREE.ImageUtils.loadTexture(path)
    this.map = new TextureAnimator(iconTexture, params.horizontal, params.vertical, params.total, params.duration)
    const material = new THREE.MeshBasicMaterial({
      map: this.map.get(),
      side: THREE.DoubleSide,
      transparent: true
    })
    this.map.get().minFilter = THREE.NearestFilter
    const geometry = new THREE.PlaneGeometry(50, 50, 1, 1)
    this.sprite = new THREE.Mesh(geometry, material)
    this.sprite.visible = false

    this.position = params.position

    this.createAnimation = new createAnimation(this.sprite, {
      y: -200,
      opacity: 0
    })
  }

  public el = () => this.sprite

  public update = (time) => this.map.update(time)

  public in = () => {
    this.createAnimation.in({
      y: this.position.y,
      opacity: 1
    }, 2000)
  }

  public out = () => {
    this.createAnimation.out(1000)
  }
}
