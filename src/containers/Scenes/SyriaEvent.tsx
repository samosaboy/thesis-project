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

  const light = new THREE.SpotLight(0xFFFFFF, 10)
  light.position.set(0, 0, 100)
  light.castShadow = false
  event.add(light)

  /* Ripple 1 */
  const geometry = new THREE.TorusGeometry(20, 2, 2, 69)
  const material = new THREE.MeshStandardMaterial({ color: '#a2b0e0' })
  const torus = new THREE.Mesh(geometry, material)
  event.add(torus)

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
