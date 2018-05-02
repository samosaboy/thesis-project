import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { RootComponent } from '../containers/App'

import * as style from '../containers/App/style.css'

import * as closeIcon from '../../assets/images/close-icon.png'

/*
 * The top left corner is the starting position
 * */

export class EventHTML {
  private parent: any
  private position: THREE.Vector3
  private camera: THREE.Camera

  private div: any
  private id: Number | string

  private heading: string
  private description: string

  constructor(params) {
    this.id = params.id

    this.heading = params.heading
    this.description = params.description

    this.div = document.createElement('div')
    this.div.style.width = '300px'
    this.div.style.position = 'absolute'
    this.div.style.opacity = 0
    this.div.style.zIndex = -999
    this.div.className = style.eventHTML
    this.div.id = this.id

    this.camera = RootComponent.getCamera()
    this.parent = params.parent
    this.position = new THREE.Vector3(0, 0, 0)

    const header = document.createElement('div')
    header.className = style.eventHTMLHeader

    const closeButton = document.createElement('button')
    closeButton.className = style.closeIcon
    closeButton.innerHTML = '<img src=' + closeIcon + ' />'
    closeButton.onclick = () => this.closeIcon()
    header.appendChild(closeButton)

    const colorIcon = document.createElement('span')
    colorIcon.style.width = '10px'
    colorIcon.style.height = '10px'
    colorIcon.style.display = 'block'
    colorIcon.style.backgroundColor = params.style.color
    colorIcon.style.borderRadius = '25px'
    colorIcon.style.marginTop = '5px'
    header.appendChild(colorIcon)

    this.div.appendChild(header)

    const eventContentDiv = document.createElement('div')
    eventContentDiv.id = 'inner_' + this.id.toString()
    this.div.appendChild(eventContentDiv)

    const head = document.createElement('span')
    head.className = style.eventHTMLHeading
    head.innerHTML = this.heading

    const des = document.createElement('span')
    des.className = style.eventHTMLDescription
    des.innerHTML = this.description

    eventContentDiv.appendChild(head)
    eventContentDiv.appendChild(des)
  }

  private closeIcon = () => {
    (this.camera as any).resetPosition()
    new TWEEN.Tween(this.div.style)
    .to({
      opacity: 0,
    }, 500)
    .easing(TWEEN.Easing.Circular.InOut)
    .onComplete(() => this.div.style.zIndex = -999)
    .start()
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

    const renderSceneDomDiv = document.getElementById('renderSceneDOM')
    const nodeArray = [].slice.call(renderSceneDomDiv.childNodes)
    renderSceneDomDiv.appendChild(this.div)

    nodeArray.forEach(node => {
      if (node.id !== this.id) {
        new TWEEN.Tween(node.style)
        .to({
          opacity: 0,
        }, 500)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete(() => node.style.zIndex = -999)
        .start()
      }
    })

    new TWEEN.Tween(this.div.style)
    .to({
      opacity: 1,
    }, 500)
    .onStart(() => this.div.style.zIndex = 999)
    .easing(TWEEN.Easing.Circular.In)
    .start()
  }

  public out = () => {
    this.div.style.opacity = 0
    this.div.style.zIndex = -999
    this.div.remove()
  }

  public update = () => {
    const coordinates = this.projectTo2D()
    this.div.style.left = `${coordinates.x}px`
    this.div.style.top = `${coordinates.y}px`
  }
}
