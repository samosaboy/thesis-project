import {
  Country,
  Scene,
  Wave,
  WaveAudio,
} from '../../components'
import { RootComponent } from '../App'

const THREE = require('three')

export const SyriaEvent = () => {
  const event = new Scene('syriaEvent')
  const syriaEvent = new Country({
    countryName: 'Syria',
    description: 'Catastrophe as a result of the civil war',
  })

  event.add(syriaEvent.sky)
  event.add(syriaEvent.terrain)
  // event.add(syriaEvent.backButton.text)
  // event.add(syriaEvent.title.text)
  // event.add(syriaEvent.description.text)

  const light = new THREE.PointLight(0xFFFFFF, 10)
  light.position.set(0, 0, 10)
  light.castShadow = false
  event.add(light)

  /*
   * Background Audio
   */
  const backgroundAudio = new THREE.Audio(RootComponent.listener)
  event.add(backgroundAudio)

  const audioLoader = new THREE.AudioLoader()

  /*
   * Country
   */
  let countryMesh = new THREE.Mesh()
  const loader = new THREE.JSONLoader()
  loader.load('../../public/objects/SyriaObj.json', obj => {
    countryMesh.geometry = obj
    countryMesh.material = new THREE.MeshBasicMaterial({
      color: '#646962',
    })
    obj.center()
    countryMesh.scale.multiplyScalar(1.2)
  })
  event.add(countryMesh)

  /*
   * Ripple 1
   * */
  const ripple1: any = new Wave({
    color: '#E0E0E0',
    linewidth: 30,
    radius: 4,
    resolution: 360,
    waveNumber: 30,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'crazy',
    waveCount: 100,
    waveScale: 0.5,
  })
  event.add(ripple1.mesh)
  const ripple1Audio = new WaveAudio('../../public/media/syria_damascus/cello_A4.mp3', {
    volume: 2,
    interval: 2000,
    color: '#E0E0E0',
  })
  event.add(ripple1Audio.audio)
  const ripple1Data = ripple1Audio.createAnalyzer()

  /*
   * Ripple 2
   * */
  const ripple2: any = new Wave({
    color: '#8cafc9',
    linewidth: 30,
    radius: 6,
    resolution: 360,
    waveNumber: 5,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.1,
  })
  event.add(ripple2.mesh)
  const ripple2Audio = new WaveAudio('../../public/media/syria_damascus/cello_D2.mp3', {
    volume: 8,
    interval: 5000,
    color: '#8cafc9',
  })
  event.add(ripple2Audio.audio)
  const ripple2Data = ripple2Audio.createAnalyzer()

  event.onIn(() => {
    syriaEvent.title.in()
    syriaEvent.description.in()
    // syriaEvent.backButton.in()

    /*
     * Play Background Audio
     * */
    audioLoader.load('../../public/media/drone_01_sound.mp3', (buffer) => {
      backgroundAudio.setBuffer(buffer)
      backgroundAudio.setLoop(true)
      backgroundAudio.setVolume(5)
      backgroundAudio.play()
    })

    ripple1.in(2000)
    ripple1Audio.playAudio()
    ripple2.in(3000)
    ripple2Audio.playAudio()
  })

  event.onOut(() => {
    syriaEvent.title.out()
    syriaEvent.description.out()
    // syriaEvent.backButton.out()

    backgroundAudio.stop()

    ripple1.out()
    ripple1Audio.stopAudio()
    ripple2.out()
    ripple2Audio.stopAudio()
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

    // TODO: Simplify this
    /*
     * Ripple 1
     * */
    ripple1.update(ripple1Data.getAverageFrequency())
    // ripple1.mesh.geometry.verticesNeedUpdate = true
    // ripple1.mesh.geometry.dynamic = true
    /*
     * Ripple 2
     * */
    ripple2.update(ripple2Data.getAverageFrequency())
    // ripple2.mesh.geometry.verticesNeedUpdate = true
    // ripple2.mesh.geometry.dynamic = true
  })


  return event
}
