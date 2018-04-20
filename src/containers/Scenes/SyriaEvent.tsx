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

export const SyriaEvent = () => {
  const event = new Scene('syriaEvent')
  event.el.position.set(0, -2000, 0)
  const syriaEvent = new Country({
    countryName: 'Syria',
    description: 'Catastrophe as a result of the civil war',
  })

  event.add(syriaEvent.sky)
  event.add(syriaEvent.terrain)

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
  loader.load('../../public/objects/SyriaObj.json', obj => {
    countryMesh.geometry = obj
    countryMesh.material = new THREE.MeshBasicMaterial({
      color: '#646962',
    })
    obj.center()
    countryMesh.scale.multiplyScalar(1.2)
  })
  countryMesh.visible = false
  event.add(countryMesh)

  // const city1 = new TextGeometry(
  //   'D A M A S C U S', {
  //     align: 'left',
  //     size: 100,
  //     lineSpacing: 15,
  //     font: 'Lato',
  //     style: 'Bold',
  //     color: '#000000',
  //     position: {
  //       x: -125,
  //       y: -75,
  //       z: 2
  //     }
  //   }
  // )
  // event.add(city1.text)

  const city1 = new CapitalCityMarker({
    city: 'D A M A S C U S',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -125,
      y: -75,
      z: 2
    }
  })

  event.add(city1.getCity().text)
  event.add(city1.getMarker())

  const city2 = new CapitalCityMarker({
    city: 'H O M S ',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -105,
      y: -15,
      z: 2
    }
  })

  event.add(city2.getCity().text)
  event.add(city2.getMarker())

  const city3 = new CapitalCityMarker({
    city: 'A L E P P O ',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -85,
      y: 70,
      z: 2
    }
  })

  event.add(city3.getCity().text)
  event.add(city3.getMarker())

  const city4 = new CapitalCityMarker({
    city: 'D A R A A',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -160,
      y: -145,
      z: 2
    }
  })
  event.add(city4.getCity().text)
  event.add(city4.getMarker())

  const city5 = new CapitalCityMarker({
    city: 'I D L E B',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -105,
      y: 55,
      z: 2
    }
  })

  event.add(city5.getCity().text)
  event.add(city5.getMarker())

  const contextCity1 = new TextGeometry(
    'T U R K E Y', {
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
  event.add(contextCity1.text)

  const contextCity2 = new TextGeometry(
    'I R A Q', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: 155,
        y: -10,
        z: 2
      }
    }
  )
  event.add(contextCity2.text)

  const contextCity3 = new TextGeometry(
    'L E B A N O N', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: -175,
        y: -45,
        z: 2
      }
    }
  )
  event.add(contextCity3.text)

  /*
   * Ripple 1
   * */

  const ripple1 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/C.mp3',
    color: '#E0E0E0',
    linewidth: 30,
    radius: 10,
    resolution: 360,
    waveNumber: 1,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'crazy',
    waveCount: 100,
    waveScale: 0.1,
    volume: 1.1,
    interval: 10000,
    duration: 5000
  })

  const ripple1Data = ripple1.analyzer()

  event.add(ripple1.waveMesh())
  event.add(ripple1.waveAudio())

  /*
   * Ripple 2
   * */

  const ripple2 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/A.mp3',
    color: '#8cafc9',
    linewidth: 30,
    radius: 3,
    resolution: 360,
    waveNumber: 5,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.1,
    volume: 1,
    interval: 60000 * 5,
    duration: 5000,
    position: {
      x: -125,
      y: -75,
      z: 3,
    }
  })

  const ripple2Data = ripple2.analyzer()

  event.add(ripple2.waveMesh())
  event.add(ripple2.waveAudio())

  /*
   * Ripple 3
   * */

  const ripple3 = new Ripple({
    soundUrl: '../../public/media/syria_damascus/G.mp3',
    color: '#b7c980',
    linewidth: 30,
    radius: 1,
    resolution: 360,
    waveNumber: 2,
    tetaOffset: 50,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 100,
    waveScale: 0.1,
    volume: 0.85,
    interval: 1500, // duration + interval
    duration: 7000,
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
    city2.getCity().in()
    city3.getCity().in()
    city4.getCity().in()
    city5.getCity().in()
    contextCity1.in()
    contextCity2.in()
    contextCity3.in()

    /*
     * Play Background Audio
     * */
    audioLoader.load('../../public/media/drone_01_sound.mp3', (buffer) => {
      backgroundAudio.setBuffer(buffer)
      backgroundAudio.setLoop(true)
      backgroundAudio.setVolume(1)
      backgroundAudio.play()
    })

    ripple1.in(1500)
    ripple1.play()
    ripple2.in(2000)
    ripple2.play()
    ripple3.in(2500)
    ripple3.play()
  })

  event.onOut(() => {
    city1.getCity().out()
    city2.getCity().out()
    city3.getCity().out()
    city4.getCity().out()
    city5.getCity().in()
    contextCity1.out()
    contextCity2.out()
    contextCity3.out()

    backgroundAudio.stop()

    ripple1.out()
    ripple1.stop()
    ripple2.out()
    ripple2.stop()
    ripple3.out()
    ripple3.stop()
  })

  event.onStart(() => {
    syriaEvent.sky.visible = true
    syriaEvent.terrain.visible = true
    countryMesh.visible = true
    light.visible = true
  })

  event.onStop(() => {
    syriaEvent.sky.visible = false
    syriaEvent.terrain.visible = false
    countryMesh.visible = false
    light.visible = false
  })

  event.onUpdate(() => {
    syriaEvent.update()
    ripple1.update(ripple1Data.getAverageFrequency())
    ripple2.update(ripple2Data.getAverageFrequency())
    ripple3.update(ripple3Data.getAverageFrequency())
  })


  return event
}
