import * as THREE from 'three'

const TWEEN = require('@tweenjs/tween.js')

interface TextGeometryParams {
  text: string,
  options: any
}
export class TextGeometry {
  private mesh: any
  private cache: any
  private group: any

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
    this.group = new THREE.Object3D()
    this.mesh = new THREE.Mesh(geometry.clone(), material.clone())
    this.mesh.position.y = 20
    // this.mesh.castShadow = true
    this.group.add(this.mesh)
    this.group.visible = false

    this.cache = {
      y: this.mesh.position.y,
      opacity: this.mesh.material.opacity,
    }
  }

  private update = () => {
    this.mesh.position.y = this.cache.y
    this.mesh.material.opacity = this.cache.opacity
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
        this.mesh.castShadow = true
      })
      .onUpdate(() => this.update())
      .start()
  }

  public out = (speed?) => {
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
          this.mesh.castShadow = false
          res()
        })
        .start()
    })
  }

  public setName = name => {
    this.mesh.name = name
    this.mesh.clickable = true
  }
}
