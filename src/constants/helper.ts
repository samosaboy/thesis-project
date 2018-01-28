/*
* The following function creates a stroke gradient to use
* with our Konva components as an attribute for shapes.
* */
export const createStrokeGradient = (colors: [string], element: any): void => {
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
    /*
    * Sample Array: [value, value, value]
    * offset[0]: 1/3 = 0.33%
    * offset[1]: 2/3 = 0.66%
    * offset[2]: 3/3 = 1.00
    * */
    gradient.addColorStop((index + 1)/colors.length, color)
  })

  return gradient
}
