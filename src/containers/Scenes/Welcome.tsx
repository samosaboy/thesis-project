import { Scene, TextGeometry } from '../../components'

const THREE = require('three')

export const Welcome = () => {
  const welcomeScene = new Scene('welcomeScene')

  const splashText = new TextGeometry({
    text: 'T H E \n R I P P L E \n E F F E C T',
    options: {
      align: 'left',
      size: 500,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Bold',
      color: '#FFFFFF',
    },
  })

  welcomeScene.add(splashText.text)

  welcomeScene.onIn(() => {
    splashText.in()
  })

  welcomeScene.onOut(() => {
    splashText.out()
  })

  welcomeScene.onUpdate(() => {})

  return welcomeScene
}
