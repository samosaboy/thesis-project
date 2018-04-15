import { Scene, TextGeometry } from '../../components'

import { RootComponent } from '../App'

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

  const splashDescription = new TextGeometry({
    text: 'Welcome',
    options: {
      align: 'left',
      size: 200,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Bold',
      color: '#FFFFFF',
      position: {
        x: 0,
        y: -40,
        z: 0
      }
    },
  })

  splashDescription.text.on('click', () => {
    RootComponent.switchScreen('pondScene')
  })
  splashDescription.text.cursor = 'pointer'

  welcomeScene.add(splashDescription.text)
  splashDescription.setName('to:pondScene')

  welcomeScene.onIn(() => {
    splashText.in()
    splashDescription.in()
  })

  welcomeScene.onOut(() => {
    splashText.out()
    splashDescription.out()
  })

  welcomeScene.onUpdate(() => {})

  return welcomeScene
}
