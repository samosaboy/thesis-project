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
* */
export const createStrokeGradient = (colors: [string], element?: any): void => {
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
  const t = speed || Math.PI

  return new Konva.Animation(() => {
    element.rotate(t)
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
    const scale = amplitude * Math.sin(2 * (frame.time/10000)) + midpoint
    element.scale({x: scale, y: scale})
  }, element.getLayer())
}
