import {
  CapitalCityMarker,
  Country,
  Ripple,
  Scene,
  TextGeometry,
} from '../../components'
import { RootComponent } from '../App'

const THREE = require('three')

import countryObj from '../../../assets/objects/SyriaObj.json'
import * as Csound from '../../../assets/media/syria_damascus/C.mp3'
import * as Asound from '../../../assets/media/syria_damascus/A.mp3'
import * as Gsound from '../../../assets/media/syria_damascus/G.mp3'
import * as droneSound from '../../../assets/media/drone_01_sound.mp3'
import { EventHTML } from 'app/components'

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
  loader.load(countryObj, obj => {
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
      z: 2,
    },
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
      z: 2,
    },
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
      z: 2,
    },
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
      z: 2,
    },
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
      z: 2,
    },
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
        z: 2,
      },
    },
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
        z: 2,
      },
    },
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
        z: 2,
      },
    },
  )
  event.add(contextCity3.text)

  /*
   * Ripple 1
   * */

  const ripple1 = new Ripple({
    soundUrl: Csound,
    color: '#6fac82',
    linewidth: 30,
    radius: 10,
    resolution: 360,
    waveNumber: 1,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'crazy',
    waveCount: 100,
    waveScale: 0.1,
    volume: 2.2,
    interval: 10000,
    duration: 5000,
  })

  const ripple1Data = ripple1.analyzer()

  event.add(ripple1.waveMesh())
  event.add(ripple1.waveAudio())

  /*
   * Ripple 2
   * */

  const ripple2 = new Ripple({
    soundUrl: Asound,
    color: '#ca7fb2',
    linewidth: 30,
    radius: 3,
    resolution: 360,
    waveNumber: 5,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.1,
    volume: 2,
    interval: 60000 * 5,
    duration: 5000,
    position: {
      x: -125,
      y: -75,
      z: 3,
    },
  })

  const ripple2Data = ripple2.analyzer()

  event.add(ripple2.waveMesh())
  event.add(ripple2.waveAudio())

  /*
   * Ripple 3
   * */

  const ripple3 = new Ripple({
    soundUrl: Gsound,
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
    volume: 1.85,
    interval: 1500, // duration + interval
    duration: 7000,
    position: {
      x: -130,
      y: -20,
      z: 3,
    },
  })

  const ripple3Data = ripple3.analyzer()

  event.add(ripple3.waveMesh())
  event.add(ripple3.waveAudio())

  /*
   * Text
   */

  const ripple1_Text = new EventHTML({
    id: 'syria-6fac82-1',
    parent: ripple1.waveMesh(),
    heading: 'Every 10 seconds one person in Syria had to make the decision to leave their homes.',
    description: `Refugees have to walk or travel on makeshift boats to neighbouring countries and continents.
    It is estimated that 5 million people (in a country that had 22 million people) have been forced out, with 6.3
    million still inside but displaced from their homes.`,
    style: {
      color: '#6fac82'
    }
  })

  const ripple2_Text = new EventHTML({
    id: 'syria-ca7fb2-1',
    parent: ripple2.waveMesh(),
    heading: 'On average, one person had died as a direct result of the civil war every 5 minutes.',
    description: `Although the statistics is not complete, as it is hard to keep track of names, on average one person
    died every 5 minutes in Damascus. Often, deaths would follow a pattern in Syria: daily slaughters in Damascus would propogate
    towards Homs, Aleppo, Daraa and Idlib, where similar events would occur.`,
    style: {
      color: '#ca7fb2'
    }
  })

  const ripple3_Text = new EventHTML({
    id: 'syria-b7c980-1',
    parent: ripple3.waveMesh(),
    heading: 'A Syrian\'s footstep as they walked their 2253 kilometre journey to Serbia.',
    description: `Horgos, Serbia is 2253 KM away, a journey that that takes approximately 50 days to complete if you were to walk 40 kilometres per day. This is roughly
    the duration of a full-time job. This sound plays every second to represent each footstep for one person.`,
    style: {
      color: '#b7c980'
    }
  })

  ripple1.clickableRegion().cursor = 'pointer'
  ripple1.clickableRegion().on('click', () => {
    ripple1_Text.in()
  })

  ripple2.clickableRegion().cursor = 'pointer'
  ripple2.clickableRegion().on('click', () => {
    ripple2_Text.in()
  })

  ripple3.clickableRegion().cursor = 'pointer'
  ripple3.clickableRegion().on('click', () => {
    ripple3_Text.in()
  })

  event.onIn(() => {
    city1.getCity().in()
    city2.getCity().in()
    city3.getCity().in()
    city4.getCity().in()
    city5.getCity().in()

    city1.in()
    city2.in()
    city3.in()
    city4.in()
    city5.in()

    contextCity1.in()
    contextCity2.in()
    contextCity3.in()

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
    city5.getCity().out()

    city1.out()
    city2.out()
    city3.out()
    city4.out()
    city5.out()

    contextCity1.out()
    contextCity2.out()
    contextCity3.out()

    ripple1.out()
    ripple1.stop()
    ripple2.out()
    ripple2.stop()
    ripple3.out()
    ripple3.stop()

    ripple1_Text.out()
    ripple2_Text.out()
    ripple3_Text.out()
  })

  event.onStart(() => {
    syriaEvent.sky.visible = true
    syriaEvent.terrain.visible = true
    countryMesh.visible = true
    light.visible = true

    city1.getMarker().visible = true
    city2.getMarker().visible = true
    city3.getMarker().visible = true
    city4.getMarker().visible = true
    city5.getMarker().visible = true
  })

  event.onStop(() => {
    syriaEvent.sky.visible = false
    syriaEvent.terrain.visible = false
    countryMesh.visible = false
    light.visible = false

    city1.getMarker().visible = false
    city2.getMarker().visible = false
    city3.getMarker().visible = false
    city4.getMarker().visible = false
    city5.getMarker().visible = false
  })

  event.onUpdate(() => {
    syriaEvent.update()
    ripple1.update(ripple1Data.getAverageFrequency())
    ripple2.update(ripple2Data.getAverageFrequency())
    ripple3.update(ripple3Data.getAverageFrequency())

    ripple1_Text.update()
    ripple2_Text.update()
    ripple3_Text.update()
  })


  return event
}
