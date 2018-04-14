import * as THREE from 'three'
import * as BAS from 'three-bas'

const TWEEN = require('@tweenjs/tween.js')

interface TextGeometryParams {
  text: string,
  options: any
}

export class TextGeometry {
  public el: any
  private cache: any
  private group: any
  private geometry: any
  private material: any

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

    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      opacity: 0,
    })

    this.geometry = new THREE.PlaneGeometry(
      canvas.width / 20,
      canvas.height / 20)

    // Group is exposed, mesh is animated
    this.group = new THREE.Object3D()
    this.el = new THREE.Mesh(this.geometry.clone(), this.material.clone())
    this.el.position.y = 20
    // this.mesh.castShadow = true
    this.group.add(this.el)
    this.group.visible = false

    this.cache = {
      y: this.el.position.y,
      opacity: this.el.material.opacity,
    }
  }

  private update = () => {
    this.el.position.y = this.cache.y
    this.el.material.opacity = this.cache.opacity
  }

  public in = (speed?) => {
    return new TWEEN.Tween(this.cache)
      .to({
        y: 0,
        opacity: 1,
      }, speed === 'fast' ? 200 : 1500)
      .easing(TWEEN.Easing.Circular.InOut)
      .onStart(() => {
        this.group.visible = true
        this.el.castShadow = true
      })
      .onUpdate(() => this.update())
      .onComplete(() => {
        console.log(this.cache)
      })
      .start()
  }

  public out = (speed?: string) => {
    return new Promise((res) => {
      new TWEEN.Tween(this.cache)
        .to({
          y: 20,
          opacity: 0,
        }, speed === 'fast' ? 200 : 1500)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate(() => this.update())
        .onComplete(() => {
          this.group.visible = false
          this.el.castShadow = false
          res()
        })
        .start()
    })
  }

  public setName = name => {
    this.el.name = name
    this.el.clickable = true
  }
}
