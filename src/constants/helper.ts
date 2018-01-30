import * as Konva from 'konva'
import {Animation} from "konva";

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
