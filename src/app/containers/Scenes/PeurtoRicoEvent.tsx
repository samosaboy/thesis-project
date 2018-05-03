import {
  CapitalCityMarker,
  Country,
  Ripple,
  Scene,
  TextGeometry,
} from '../../components'
import { RootComponent } from '../App'

import countryObj from '../../../assets/objects/PeurtoRicoObj.json'
import * as Csound from '../../../assets/media/syria_damascus/C.mp3'
import * as Csound2 from '../../../assets/media/syria_damascus/C(1).mp3'
import * as highGsound from '../../../assets/media/syria_damascus/HighG.mp3'
import * as highGsound2 from '../../../assets/media/syria_damascus/HighG(1).mp3'
import * as lowGsound from '../../../assets/media/syria_damascus/LowG.mp3'
import { EventHTML } from 'app/components'

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
  loader.load(countryObj, obj => {
    countryMesh.geometry = obj
    countryMesh.material = new THREE.MeshBasicMaterial({
      color: '#646962',
    })
    obj.center()
    countryMesh.scale.multiplyScalar(3.5)
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
    color: '#000000',
    position: {
      x: 105,
      y: 76,
      z: 2,
    },
  })

  event.add(city1.getCity().text)
  event.add(city1.getMarker())

  const city2 = new CapitalCityMarker({
    city: 'P O N C E',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -50,
      y: -60,
      z: 2,
    },
  })

  event.add(city2.getCity().text)
  event.add(city2.getMarker())

  const city3 = new CapitalCityMarker({
    city: 'M A Y A G U E Z',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -195,
      y: 0,
      z: 2,
    },
  })

  event.add(city3.getCity().text)
  event.add(city3.getMarker())

  const city4 = new CapitalCityMarker({
    city: 'A R E C I B O',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -75,
      y: 75,
      z: 2,
    },
  })

  event.add(city4.getCity().text)
  event.add(city4.getMarker())

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
        y: 125,
        z: 2,
      },
    },
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
        y: -125,
        z: 2,
      },
    },
  )
  event.add(contextRegion2.text)

  /*
   * Ripple 1
   * */

  const ripple1 = new Ripple({
    soundUrl: Csound,
    color: '#e0817d',
    linewidth: 30,
    radius: 3,
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
      x: 110,
      y: 72,
      z: 1.5,
    },
  })

  const ripple1Data = ripple1.analyzer()

  event.add(ripple1.waveMesh())
  event.add(ripple1.waveAudio())

  /*
   * Ripple 1 _ 2
   * */

  const ripple1_2 = new Ripple({
    soundUrl: Csound2,
    color: '#e0817d',
    linewidth: 30,
    radius: 3,
    resolution: 360,
    waveNumber: 3,
    tetaOffset: 50,
    waveLength: 10,
    waveType: 'normal',
    waveCount: 100,
    waveScale: 0.05,
    volume: 2.1,
    interval: 2000,
    position: {
      x: 100,
      y: 60,
      z: 1.5,
    },
  })

  const ripple1_2Data = ripple1_2.analyzer()

  event.add(ripple1_2.waveMesh())
  event.add(ripple1_2.waveAudio())

  /*
   * Ripple 2
   * */

  const ripple2 = new Ripple({
    soundUrl: highGsound,
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
    interval: 30000,
    position: {
      x: -55,
      y: -70,
      z: 3,
    },
  })

  const ripple2Data = ripple2.analyzer()

  event.add(ripple2.waveMesh())
  event.add(ripple2.waveAudio())

  /*
   * Ripple 2 _ 2
   * */

  const ripple2_2 = new Ripple({
    soundUrl: highGsound2,
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
    interval: 30000,
    position: {
      x: -77,
      y: 70,
      z: 3,
    },
  })

  const ripple2_2Data = ripple2_2.analyzer()

  event.add(ripple2_2.waveMesh())
  event.add(ripple2_2.waveAudio())

  /*
   * Ripple 3
   * */

  const ripple3 = new Ripple({
    soundUrl: lowGsound,
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
    interval: 15000, // duration + interval
    position: {
      x: -200,
      y: -10,
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
    id: 'pr-e0817d-1',
    parent: ripple1.waveMesh(),
    heading: 'Every 1 - 2 seconds, a person had lost their home due to the flooding.',
    description: `Majority of the island's homes were built on faulty, unstable land. Majority of the homes were also
    built poorly. As a result, homes were easily destroyed and people were displaced.`,
    style: {
      color: '#e0817d',
    },
  })

  const ripple1_2_Text = new EventHTML({
    id: 'pr-e0817d-2',
    parent: ripple1_2.waveMesh(),
    heading: 'Every 1 - 2 seconds, a person had lost their home due to the flooding.',
    description: `Majority of the island's homes were built on faulty, unstable land. Majority of the homes were also
    built poorly. As a result, homes were easily destroyed and people were displaced.`,
    style: {
      color: '#e0817d',
    },
  })

  const ripple2_2_Text = new EventHTML({
    id: 'pr-c5c968-2',
    parent: ripple2_2.waveMesh(),
    heading: 'Every 30 seconds, someone required serious medical attention.',
    description: `Data from the Puerto Rico Institute states that in September 2017, 94 people died per day from the
    impact of the hurricane. In total, the month of September 2887 people died.`,
    style: {
      color: '#c5c968',
    },
  })

  const ripple2_Text = new EventHTML({
    id: 'pr-c5c968-1',
    parent: ripple2.waveMesh(),
    heading: 'Every 30 seconds, someone required serious medical attention.',
    description: `Data from the Puerto Rico Institute states that in September 2017, 94 people died per day from the
    impact of the hurricane. In total, the month of September 2887 people died.`,
    style: {
      color: '#c5c968',
    },
  })

  const ripple3_Text = new EventHTML({
    id: 'pr-67c9b5-2',
    parent: ripple3.waveMesh(),
    heading: 'Every 15 seconds, a family lost electricity, access to potable water and cell service.',
    description: `Unfortunately, power was not restored until four months later; neither was distribution of potable water
    to survivors. By January 2018, only 65% of the electricity had been restored. Fortunately, 86% of the population had
    access to clean, drinking water.`,
    style: {
      color: '#67c9b5',
    },
  })

  ripple1.clickableRegion().cursor = 'pointer'
  ripple1.clickableRegion().on('click', () => {
    ripple1_Text.in()
  })

  ripple1_2.clickableRegion().cursor = 'pointer'
  ripple1_2.clickableRegion().on('click', () => {
    ripple1_2_Text.in()
  })

  ripple2.clickableRegion().cursor = 'pointer'
  ripple2.clickableRegion().on('click', () => {
    ripple2_Text.in()
  })

  ripple2_2.clickableRegion().cursor = 'pointer'
  ripple2_2.clickableRegion().on('click', () => {
    ripple2_2_Text.in()
  })

  ripple3.clickableRegion().cursor = 'pointer'
  ripple3.clickableRegion().on('click', () => {
    ripple3_Text.in()
  })

  event.onIn(() => {
    contextRegion1.in()
    contextRegion2.in()
    contextRegion2.in()

    city1.in()
    city2.in()
    city3.in()
    city4.in()

    ripple1.in(1500)
    ripple1.play()
    ripple1_2.in(1500)
    ripple1_2.play()
    ripple2.in(2000)
    ripple2.play()
    ripple2_2.in(2100)
    ripple2_2.play()
    ripple3.in(2500)
    ripple3.play()
  })

  event.onOut(() => {
    contextRegion1.out()
    contextRegion2.out()
    contextRegion2.out()

    city1.out()
    city2.out()
    city3.out()
    city4.out()

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

    ripple1_Text.out()
    ripple2_Text.out()
    ripple2_2_Text.out()
    ripple1_2_Text.out()
    ripple3_Text.out()
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

    ripple1_Text.update()
    ripple1_2_Text.update()
    ripple2_2_Text.update()
    ripple2_Text.update()
    ripple3_Text.update()
  })


  return event
}
