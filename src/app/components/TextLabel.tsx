import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { RootComponent } from '../containers/App'

export class TextLabel {
  private parent: any
  private position: THREE.Vector3
  private camera: THREE.Camera
  private text: Array<string>

  private animate: any

  public span: any

  constructor(params) {
    this.span = document.createElement('span')
    this.span.className = 'text-label'
    this.span.style.color = params.style.color || '#FFFFFF'
    this.span.style.fontFamily = params.style.font || 'Lora'
    this.span.style.fontSize = `${params.style.size}px` || '20px'
    this.span.style.fontWeight = params.style.weight || 400
    this.span.style.position = 'absolute'
    this.span.style.opacity = 1
    this.span.innerHTML = params.text

    this.text = params.text.split('')

    this.camera = RootComponent.getCamera()
    this.parent = params.parent
    this.position = new THREE.Vector3(0, 0, 0)

    this.animate = new TWEEN.Tween(this.span.style)
    .to({ opacity: 1 }, 2000)
    .easing(TWEEN.Easing.Circular.In)

  }

  private projectTo2D = () => {
    const vector = this.parent.matrixWorld.getPosition().clone()
    vector.project(this.camera)

    vector.x = (vector.x + 1) / 2 * window.innerWidth
    vector.y = -(vector.y - 1) / 2 * window.innerHeight
    vector.z = 5

    return vector
  }

  public in = () => this.animate.start()

  public out = () => this.animate.stop()

  public update = () => {
    const coordinates = this.projectTo2D()
    this.span.style.left = `${coordinates.x}px`
    this.span.style.top = `${coordinates.y}px`
  }

  public getElement = () => this.span

}
