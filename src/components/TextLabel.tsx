import * as THREE from 'three'

interface TextLabelParams {
  parent?: any
  camera?: THREE.Camera,
  position?: THREE.Vector3,
  text: string
}

export default class TextLabel {
  private parent: any
  private position: THREE.Vector3
  private camera: THREE.Camera

  private span: any

  constructor(params?: TextLabelParams) {
    this.span = document.createElement('span')
    this.span.className = 'text-label'
    this.span.style.position = 'absolute'
    this.span.style.width = '100px'
    this.span.style.height = '100px'
    this.span.innerHTML = params.text
    this.span.style.top = '-1000px'
    this.span.style.left = '-1000px'

    this.camera = params.camera
    this.parent = params.parent
    this.position = params.position || new THREE.Vector3(0, 0, 0)
  }

  private get2DCords = () => {
    const vector = this.position.project(this.camera)

    vector.x = (vector.x + 1) / 2 * window.innerWidth
    vector.y = -(vector.y - 1) / 2 * window.innerHeight

    return vector
  }

  public updatePosition = () => {
    if (this.parent) {
      this.position.copy(this.parent.position)
    }
    const coords = this.get2DCords()
    this.span.style.left = `${coords.x}px`
    this.span.style.top = `${coords.y}px`
  }

  public getElement = () => this.span

}
