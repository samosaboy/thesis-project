import {
  CapitalCityMarker,
  Country,
  Ripple,
  Scene,
  TextGeometry,
  Wave,
  WaveAudio,
} from '../../components'
import { RootComponent } from '../App'

const THREE = require('three')

export const PeurtoRicoEvent = () => {
  const event = new Scene('peurtoRicoEvent')
  event.el.position.set(0, -2000, 0)
  const eventCountry = new Country({
    countryName: 'Syria',
    description: 'Catastrophe as a result of the civil war',
  })

  event.add(eventCountry.sky)
  event.add(eventCountry.terrain)

  const light = new THREE.PointLight(0xFFFFFF, 10)
  light.position.set(0, 0, 10)
  light.castShadow = false
  light.visible = false
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
  loader.load('../../public/objects/PeurtoRicoObj.json', obj => {
    countryMesh.geometry = obj
    countryMesh.material = new THREE.MeshBasicMaterial({
      color: '#646962',
    })
    obj.center()
    countryMesh.scale.multiplyScalar(2.5)
  })
  countryMesh.visible = false
  event.add(countryMesh)

  const city1 = new CapitalCityMarker({
    city: 'S A N     J U A N',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#cacaca',
    position: {
      x: 30,
      y: 60,
      z: 2
    }
  })

  event.add(city1.getCity().text)
  event.add(city1.getMarker())

  const contextRegion1 = new TextGeometry(
    'A T L A N T I C     O C E A N', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: 0,
        y: 150,
        z: 2
      }
    }
  )
  event.add(contextRegion1.text)

  const contextRegion2 = new TextGeometry(
    'C A R I B B E A N     S E A', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: 0,
        y: -150,
        z: 2
      }
    }
  )
  event.add(contextRegion2.text)

  /*
   * Ripple 1
   * */

  const ripple1 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/C.mp3',
    color: '#e0817d',
    linewidth: 30,
    radius: 1,
    resolution: 360,
    waveNumber: 2,
    tetaOffset: 50,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 100,
    waveScale: 0.1,
    volume: 1.85,
    interval: 1000,
    position: {
      x: 30,
      y: 55,
      z: 1.5,
    }
  })

  const ripple1Data = ripple1.analyzer()

  event.add(ripple1.waveMesh())
  event.add(ripple1.waveAudio())

  /*
   * Ripple 1 _ 2
   * */

  const ripple1_2 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/C(1).mp3',
    color: '#e0817d',
    linewidth: 30,
    radius: 1,
    resolution: 360,
    waveNumber: 3,
    tetaOffset: 50,
    waveLength: 10,
    waveType: 'normal',
    waveCount: 100,
    waveScale: 0.05,
    volume: 2.1,
    interval: 1300,
    position: {
      x: 40,
      y: 53,
      z: 1.5,
    }
  })

  const ripple1_2Data = ripple1_2.analyzer()

  event.add(ripple1_2.waveMesh())
  event.add(ripple1_2.waveAudio())

  /*
   * Ripple 2
   * */

  const ripple2 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/HighG.mp3',
    color: '#c5c968',
    linewidth: 30,
    radius: 1.5,
    resolution: 360,
    waveNumber: 1,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.1,
    volume: 1.55,
    interval: 5000,
    position: {
      x: -115,
      y: -50,
      z: 3,
    }
  })

  const ripple2Data = ripple2.analyzer()

  event.add(ripple2.waveMesh())
  event.add(ripple2.waveAudio())

  /*
   * Ripple 2 _ 2
   * */

  const ripple2_2 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/HighG(1).mp3',
    color: '#c5c968',
    linewidth: 30,
    radius: 1.2,
    resolution: 360,
    waveNumber: 1.5,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.2,
    volume: 1.55,
    interval: 5300,
    position: {
      x: -105,
      y: 60,
      z: 3,
    }
  })

  const ripple2_2Data = ripple2_2.analyzer()

  event.add(ripple2_2.waveMesh())
  event.add(ripple2_2.waveAudio())

  /*
   * Ripple 3
   * */

  const ripple3 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/LowG.mp3',
    color: '#67c9b5',
    linewidth: 30,
    radius: 1,
    resolution: 360,
    waveNumber: 2,
    tetaOffset: 50,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 100,
    waveScale: 0.1,
    volume: 2.1,
    interval: 1500, // duration + interval
    position: {
      x: -130,
      y: -20,
      z: 3,
    }
  })

  const ripple3Data = ripple3.analyzer()

  event.add(ripple3.waveMesh())
  event.add(ripple3.waveAudio())

  event.onIn(() => {
    city1.getCity().in()
    contextRegion1.in()
    contextRegion2.in()
    contextRegion2.in()

    city1.in()

    /*
     * Play Background Audio
     * */
    audioLoader.load('../../public/media/atmosphereic_drone_03.wav', (buffer) => {
      backgroundAudio.setBuffer(buffer)
      backgroundAudio.setLoop(true)
      backgroundAudio.setVolume(2)
      backgroundAudio.play()
    })

    ripple1.in(1500)
    ripple1.play()
    ripple1_2.in(1500)
    ripple1_2.play()
    ripple2.in(2000)
    ripple2.play()
    ripple2_2.in(1500)
    ripple2_2.play()
    ripple3.in(2500)
    ripple3.play()
  })

  event.onOut(() => {
    city1.getCity().out()
    contextRegion1.out()
    contextRegion2.out()
    contextRegion2.out()

    city1.out()

    backgroundAudio.stop()

    ripple1.out()
    ripple1.stop()
    ripple1_2.out()
    ripple1_2.stop()
    ripple2.out()
    ripple2.stop()
    ripple2_2.out()
    ripple2_2.stop()
    ripple3.out()
    ripple3.stop()
  })

  event.onStart(() => {
    eventCountry.sky.visible = true
    eventCountry.terrain.visible = true
    countryMesh.visible = true
    light.visible = true

    city1.getMarker().visible = true
  })

  event.onStop(() => {
    eventCountry.sky.visible = false
    eventCountry.terrain.visible = false
    countryMesh.visible = false
    light.visible = false

    city1.getMarker().visible = false
  })

  event.onUpdate(() => {
    eventCountry.update()
    ripple1.update(ripple1Data.getAverageFrequency())
    ripple1_2.update(ripple1_2Data.getAverageFrequency())
    ripple2.update(ripple2Data.getAverageFrequency())
    ripple2_2.update(ripple2_2Data.getAverageFrequency())
    ripple3.update(ripple3Data.getAverageFrequency())
  })


  return event
}
