import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { RootComponent } from '../containers/App'

/*
 * The top left corner is the starting position
 * */

export class EventHTML {
  private parent: any
  private position: THREE.Vector3
  private camera: THREE.Camera

  private animate: any

  private div: any
  private id: Number | string

  constructor(params) {
    this.div = document.createElement('div')
    this.div.className = 'event-div'
    this.div.style.backgroundColor = params.style.color
    this.div.style.width = params.style.width + 'px'
    this.div.style.height = params.style.height + 'px'
    this.div.style.position = 'absolute'
    this.div.style.opacity = 1

    this.id = params.id

    this.camera = RootComponent.getCamera()
    this.parent = params.parent
    this.position = new THREE.Vector3(0, 0, 0)

    this.div.innerHTML = '<span>Close</span>'

    const eventContentDiv = document.createElement('div')
    eventContentDiv.id = this.id.toString()
    this.div.appendChild(eventContentDiv)

    this.animate = new TWEEN.Tween(this.div.style)
    .to({ opacity: 0.5 }, 2000)
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
    this.div.style.left = `${coordinates.x}px`
    this.div.style.top = `${coordinates.y}px`
  }

  public getContainer = () => this.div

  public getContentContainer = () => this.div.querySelector('#' + this.id)

}
