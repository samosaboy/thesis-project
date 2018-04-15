import * as THREE from 'three'
import { createAnimation } from './Utils'

export class TextGeometry {
  public text: any
  private position: THREE.Vector3

  private createAnimation: any

  constructor(text: string, params) {
    const words = text.split('\n')

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].replace(/^\s+|\s+$/g, '')
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const font = params.style + ' ' + params.size + 'px' + ' ' + params.font

    context.font = font

    let maxWidth: number = null

    for (let j = 0; j < words.length; j++) {
      const tempWidth = context.measureText(words[j]).width
      if (tempWidth > maxWidth) {
        maxWidth = tempWidth
      }
    }

    const width = maxWidth

    const lineHeight = params.size + params.lineSpacing
    const height = lineHeight * words.length

    if (!!params.label) {
      canvas.width = width * 2
      canvas.height = height * 3
    } else {
      canvas.width = width + 20
      canvas.height = height + 20
    }

    context.font = font
    context.fillStyle = params.color
    context.textAlign = params.align
    context.textBaseline = 'top'

    if (!!params.label) {
      // context.fillStyle = '#FFF'
      // context.fillRect(0, 0, canvas.width, canvas.height / 2)
      context.beginPath()
      context.lineWidth = 15
      context.strokeStyle = 'white'
      context.rect(0, 0, canvas.width, canvas.height / 2)
      context.stroke()
    }

    for (let k = 0; k < words.length; k++) {
      const word = words[k]

      let left

      if (params.align === 'left') {
        left = 0
      } else if (params.align === 'center') {
        left = canvas.width / 2
      } else {
        left = canvas.width
      }

      if (!!params.label) {
        context.fillStyle = '#FFF'
        context.fillText(word, left, 40)
      } else {
        context.fillStyle = '#FFF'
        context.fillText(word, left, lineHeight * k)
      }
    }
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
    })

    const geometry = new THREE.PlaneGeometry(
      canvas.width / 20,
      canvas.height / 20)

    // Group is exposed, mesh is animated
    this.text = new THREE.Mesh(geometry.clone(), material.clone())
    this.position = params.position || new THREE.Vector3(0, 0, 0)
    this.text.visible = false

    this.createAnimation = new createAnimation(this.text, {
      y: this.position.y < 0 / 2 ? -200 : 200,
      opacity: 0,
    })
  }

  public in = () => {
    this.createAnimation.in({
      y: this.position.y,
      opacity: 1,
    }, 1000)
  }

  public out = (dur?: number) => {
    this.createAnimation.out(dur || 1000)
  }

  public setName = name => {
    this.text.name = name
    this.text.clickable = true
  }
}
