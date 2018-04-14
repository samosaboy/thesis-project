import * as THREE from 'three'
import { createAnimation } from './Utils'

interface TextGeometryParams {
  text: string,
  options: any
}

export class TextGeometry {
  public text: any

  private createAnimation: any

  constructor(params?: TextGeometryParams) {
    const words = params.text.split('\n')

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].replace(/^\s+|\s+$/g, '')
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const font = params.options.style + ' ' + params.options.size + 'px' + ' ' + params.options.font

    context.font = font

    let maxWidth: number = null

    for (let j = 0; j < words.length; j++) {
      const tempWidth = context.measureText(words[j]).width
      if (tempWidth > maxWidth) {
        maxWidth = tempWidth
      }
    }

    const width = maxWidth

    const lineHeight = params.options.size + params.options.lineSpacing
    const height = lineHeight * words.length

    canvas.width = width + 20
    canvas.height = height + 20

    context.font = font
    context.fillStyle = params.options.color
    context.textAlign = params.options.align
    context.textBaseline = 'top'

    for (let k = 0; k < words.length; k++) {
      const word = words[k]

      let left

      if (params.options.align === 'left') {
        left = 0
      } else if (params.options.align === 'center') {
        left = canvas.width / 2
      } else {
        left = canvas.width
      }

      context.fillText(word, left, lineHeight * k)
    }

    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      opacity: 0,
    })

    const geometry = new THREE.PlaneGeometry(
      canvas.width / 20,
      canvas.height / 20)

    // Group is exposed, mesh is animated
    this.text = new THREE.Mesh(geometry.clone(), material.clone())
    this.text.position.y = 20

    this.createAnimation = new createAnimation(this.text, {
      y: this.text.position.y,
      opacity: this.text.material.opacity
    })
  }

  public in = () => {
    this.createAnimation.in({
      y: 0,
      opacity: 1
    }, 1000)
  }

  public out = () => {
    this.createAnimation.out(1000)
  }

  public setName = name => {
    this.text.name = name
    this.text.clickable = true
  }
}
