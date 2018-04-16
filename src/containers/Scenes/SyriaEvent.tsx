import {
  Country,
  Scene,
} from '../../components'

const THREE = require('three')

export const SyriaEvent = () => {
  const event = new Scene('syriaEvent')
  const syriaEvent = new Country({
    countryName: 'Syria',
    description: 'Catastrophe as a result of the civil war',
  })

  event.add(syriaEvent.sky)
  event.add(syriaEvent.terrain)
  event.add(syriaEvent.backButton.text)
  event.add(syriaEvent.title.text)
  event.add(syriaEvent.description.text)

  event.onIn(() => {
    syriaEvent.title.in()
    syriaEvent.description.in()
    syriaEvent.backButton.in()
  })

  event.onOut(() => {
    syriaEvent.title.out()
    syriaEvent.description.out()
    syriaEvent.backButton.out()
  })

  event.onStart(() => {
    syriaEvent.sky.visible = true
    syriaEvent.terrain.visible = true
  })

  event.onStop(() => {
    syriaEvent.sky.visible = false
    syriaEvent.terrain.visible = false
  })

  event.onUpdate(() => {
    syriaEvent.update()
  })


  return event
}
