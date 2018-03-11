/*
* The following helper functions are created
* by Nikunj Varshney (http://www.nikunj.ca)
* for my Thesis at OCAD University, Toronto.
* */
import * as Konva from 'konva'
import {Animation} from 'konva'

/*
* The following function creates a stroke gradient to use
* with our Konva components as an attribute for shapes.
*
* @return CanvasGradient
* */
export const createStrokeGradient = (colors: Array<string>, element?: any): any => {
  //TODO: What if its a line
  let context: any
  let end: any

  if (!element) {
    const canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    end = 25
  } else {
    context = element.getCanvas().getContext()
    end = element.radius() / 2
  }

  const gradient = context.createLinearGradient(-end, -end, end, end)
  colors.forEach((color, index) => {
    gradient.addColorStop((index + 1) / colors.length, color)
  })

  return gradient
}

/*
* The following function creates a rotation animation
* for an element at a specified (optional) speed
* */
export const createRotation = (element: any, speed?: number): Animation => {
  return new Konva.Animation(() => {
    element.rotate(speed || Math.PI)
  }, element.getLayer())
}

/*
* The following function creates a breathing scale effect
* for an element with the following:
*
* @param amplitude: Peak amplitude of the wave (0.9 -> 1.1 = 0.1)
* @param midpoint: Midpoint of the wave to oscillate around
* */
export const createBreatheScale = (element: any, amplitude: number, midpoint: number): Animation => {
  return new Konva.Animation(frame => {
    const scale = amplitude * Math.sin(2 * (frame.time / 10000)) + midpoint

    element.scale({
      x: scale,
      y: scale,
    })
  }, element.getLayer())
}

/*
* The following function uses a gradient to create
* our spinning ladda component.
* */
export const createLaddaGradient = (element: any): void => {
  let context: any

  if (!element) {
    const canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
  } else {
    context = element.getCanvas().getContext()
  }

  const gradient = context.createLinearGradient(0, 0, 20, 20)

  for (let i = 1; i < 90; i++) {
    gradient.addColorStop(i / 100, '#E2DED9')
  }
  gradient.addColorStop(0.9, '#5e5e5e')

  return gradient
}

export const createOscillation = (element: any, radius: number, id: number): any => {
  /*
  * Maybe we can clone element and add it using add() to the stage?
  * Then in our return create a new animation with that element and
  * offset it by a bit... hmm..
  * */
  return new Konva.Animation(frame => {
    const t = 0.1 * Math.sin(0.1 * radius * (frame.time / 10000)) + 1
    element.scale({
      x: t,
      y: t,
    })
  }, element.getLayer())
}
