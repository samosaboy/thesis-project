import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

interface TextLabelParams {
  parent?: any
  camera?: THREE.Camera,
  position?: THREE.Vector3,
  text: string,
  style: any
}

export default class TextLabel {
  private parent: any
  private position: THREE.Vector3
  private camera: THREE.Camera
  private text: Array<string>

  private animate: any

  private span: any

  constructor(params?: TextLabelParams) {
    this.span = document.createElement('span')
    this.span.className = 'text-label'
    this.span.style.color = params.style.color || '#FFFFFF'
    this.span.style['font-family'] = params.style.font
    this.span.style['font-size'] = `${params.style.size}px` || '20px'
    this.span.style['font-weight'] = params.style.weight
    this.span.style.position = 'absolute'
    this.span.style.opacity = 0
    this.span.innerHTML = params.text

    this.text = params.text.split('')

    this.camera = params.camera
    this.parent = params.parent
    this.position = params.position || new THREE.Vector3(0, 0, 0)

    this.animate = new TWEEN.Tween(this.span.style)
      .to({ opacity: 1 }, 2000)
      .easing(TWEEN.Easing.Circular.In)

  }

  private projectTo2D = () => {
    const vector = this.position.project(this.camera)

    // TODO: Fix this
    vector.x = ((vector.x + 1) / 2 * window.innerWidth) - (this.text.length * 20)
    vector.y = -(vector.y - 1) / 2 * window.innerHeight

    return vector
  }

  public start = () => this.animate.start()

  public stop = () => this.animate.stop()

  public updatePosition = () => {
    if (this.parent) {
      this.position.copy(this.parent.position)
    }
    const coordinates = this.projectTo2D()
    this.span.style.left = `${coordinates.x}px`
    this.span.style.top = `${coordinates.y}px`
  }

  public getElement = () => this.span

}
