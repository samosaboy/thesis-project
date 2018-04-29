import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { RootComponent } from '../containers/App'

import * as style from '../containers/App/style.css'

/*
 * The top left corner is the starting position
 * */

export class EventHTML {
  private parent: any
  private position: THREE.Vector3
  private camera: THREE.Camera

  private div: any
  private id: Number | string

  constructor(params) {
    this.div = document.createElement('div')
    this.div.className = 'event-div'
    this.div.style.backgroundColor = params.style.color
    this.div.style.width = params.style.width + 'px'
    this.div.style.position = 'absolute'
    // this.div.style.opacity = 0
    // this.div.style.zIndex = -999
    this.div.className = style.eventHTML

    this.id = params.id

    this.camera = RootComponent.getCamera()
    this.parent = params.parent
    this.position = new THREE.Vector3(0, 0, 0)

    const closeButton = document.createElement('button')
    closeButton.className = style.closeIcon
    closeButton.innerHTML = '<img src="../../assets/images/close-icon.png" />'
    closeButton.onclick = () => this.closeIcon()

    this.div.appendChild(closeButton)

    const eventContentDiv = document.createElement('div')
    eventContentDiv.id = this.id.toString()
    this.div.appendChild(eventContentDiv)
  }

  private closeIcon = () => {
    (this.camera as any).resetPosition()
    this.div.style.opacity = 0
    this.div.style.zIndex = -999
  }

  private projectTo2D = () => {
    const vector = this.parent.matrixWorld.getPosition().clone()
    vector.project(this.camera)

    vector.x = (vector.x + 1) / 2 * window.innerWidth
    vector.y = -(vector.y - 1) / 2 * window.innerHeight
    vector.z = 5

    return vector
  }

  public in = () => {
    (this.camera as any).zoom(this.parent)
    new TWEEN.Tween(this.div.style)
    .to({ opacity: 1, zIndex: 999 }, 100)
    .easing(TWEEN.Easing.Circular.In)
    .start()
  }

  public out = () => {
    new TWEEN.Tween(this.div.style)
    .to({ opacity: 0, zIndex: -999 }, 100)
    .easing(TWEEN.Easing.Circular.In)
    .start()
  }

  public update = () => {
    const coordinates = this.projectTo2D()
    this.div.style.left = `${coordinates.x}px`
    this.div.style.top = `${coordinates.y}px`
  }

  public setEventText = (heading, description) => {
    console.log(heading)
    const head = document.createElement('span')
    head.className = style.eventHTMLHeading
    head.innerHTML = heading

    const des = document.createElement('span')
    des.className = style.eventHTMLDescription
    des.innerHTML = description

    this.div.querySelector('#' + this.id).appendChild(head)
    this.div.querySelector('#' + this.id).appendChild(des)
    const renderSceneDomDiv = document.getElementById('renderSceneDOM')
    renderSceneDomDiv.appendChild(this.div)
  }

}
