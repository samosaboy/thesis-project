const THREE = require('three')

export const createCircularCanvasMaterial = (colour, size) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')

  const texture = new THREE.Texture(canvas)
  const center = size / 2
  context.beginPath()
  context.arc(center, center, center, 0, 2 * Math.PI, false)
  context.closePath()
  context.fillStyle = colour
  context.fill()
  texture.needsUpdate = true

  return texture
}
