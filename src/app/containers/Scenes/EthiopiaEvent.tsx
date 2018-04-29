import * as React from 'react'
import {
  CapitalCityMarker,
  Country,
  Ripple,
  Scene,
  TextGeometry,
  EventHTML,
} from '../../components'
import { RootComponent } from '../App'

import ethiopiaObj from '../../../assets/objects/EthiopiaObj.json'
import * as Csound from '../../../assets/media/syria_damascus/C.mp3'
import * as Csound2 from '../../../assets/media/syria_damascus/C(1).mp3'
import * as Asound from '../../../assets/media/syria_damascus/A.mp3'
import * as Gsound from '../../../assets/media/syria_damascus/HighG.mp3'
import * as lowGsound from '../../../assets/media/syria_damascus/LowG.mp3'
import * as dronesound from '../../../assets/media/drone_02_sound.mp3'

const THREE = require('three')

export const EthiopiaEvent = () => {
  const event = new Scene('ethiopiaEvent')
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

  /*
   * Country
   */
  let countryMesh = new THREE.Mesh()
  const loader = new THREE.JSONLoader()
  loader.load(ethiopiaObj, obj => {
    countryMesh.geometry = obj
    countryMesh.material = new THREE.MeshBasicMaterial({
      color: '#646962',
    })
    obj.center()
    countryMesh.scale.multiplyScalar(0.65)
  })
  countryMesh.visible = false
  event.add(countryMesh)

  const city1 = new CapitalCityMarker({
    city: 'A D D I S     A B A B A',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -60,
      y: 0,
      z: 2,
    },
  })

  event.add(city1.getCity().text)
  event.add(city1.getMarker())

  const city2 = new CapitalCityMarker({
    city: 'G O N D A R',
    align: 'left',
    size: 100,
    lineSpacing: 15,
    font: 'Lato',
    style: 'Bold',
    color: '#000000',
    position: {
      x: -75,
      y: 70,
      z: 2,
    },
  })

  event.add(city2.getCity().text)
  event.add(city2.getMarker())

  const contextRegion1 = new TextGeometry(
    'R E D     S E A', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: 80,
        y: 150,
        z: 2,
      },
    },
  )
  event.add(contextRegion1.text)

  const contextRegion2 = new TextGeometry(
    'K E N Y A', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: -75,
        y: -180,
        z: 2,
      },
    },
  )
  event.add(contextRegion2.text)

  const contextRegion3 = new TextGeometry(
    'S U D A N', {
      align: 'left',
      size: 100,
      lineSpacing: 15,
      font: 'Lato',
      style: 'Bold',
      color: '#afafaf',
      position: {
        x: -165,
        y: 110,
        z: 2,
      },
    },
  )
  event.add(contextRegion3.text)

  /*
   * Ripple 1
   * */

  const ripple1 = new Ripple({
    soundUrl: Csound,
    color: '#6269e0',
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
    interval: 1200,
    position: {
      x: -60,
      y: 0,
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
    color: '#6269e0',
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
    interval: 6000,
    position: {
      x: -90,
      y: 100,
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
    soundUrl: Asound,
    color: '#c970be',
    linewidth: 30,
    radius: 2,
    resolution: 360,
    waveNumber: 1,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.1,
    volume: 1,
    interval: 500,
    position: {
      x: 130,
      y: -50,
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
    soundUrl: Gsound,
    color: '#c970be',
    linewidth: 30,
    radius: 2.5,
    resolution: 360,
    waveNumber: 1.5,
    tetaOffset: 120,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 240,
    waveScale: 0.2,
    volume: 2,
    interval: 1500,
    position: {
      x: 150,
      y: -80,
      z: 3,
    },
  })

  const ripple2_2Data = ripple2_2.analyzer()

  event.add(ripple2_2.waveMesh())
  event.add(ripple2_2.waveAudio())

  const ripple2_2_Text = new EventHTML({
    id: 'test1',
    parent: ripple2_2.waveMesh(),
    style: {
      color: '#26262f',
      width: 300,
      height: 300
    }
  })

  ripple2_2.clickableRegion().cursor = 'pointer'
  ripple2_2.clickableRegion().on('click', () => {
    ripple2_2_Text.in()
  })

  /*
   * Ripple 3
   * */

  const ripple3 = new Ripple({
    soundUrl: lowGsound,
    color: '#e05d00',
    linewidth: 30,
    radius: 1.5,
    resolution: 360,
    waveNumber: 2,
    tetaOffset: 50,
    waveLength: 1,
    waveType: 'normal',
    waveCount: 100,
    waveScale: 0.1,
    volume: 2.1,
    interval: 20000, // duration + interval
    position: {
      x: -130,
      y: -20,
      z: 3,
    },
  })

  const ripple3Data = ripple3.analyzer()

  event.add(ripple3.waveMesh())
  event.add(ripple3.waveAudio())

  event.onIn(() => {
    city1.getCity().in()
    city2.getCity().in()
    contextRegion1.in()
    contextRegion2.in()
    contextRegion2.in()
    contextRegion3.in()

    city1.in()
    city2.in()

    /*
     * Play Background Audio
     * */
    // audioLoader.load(dronesound, (buffer) => {
    //   backgroundAudio.setBuffer(buffer)
    //   backgroundAudio.setLoop(true)
    //   backgroundAudio.setVolume(1)
    //   backgroundAudio.play()
    // })

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
    city2.getCity().out()
    contextRegion1.out()
    contextRegion2.out()
    contextRegion2.out()
    contextRegion3.out()

    city1.out()
    city2.out()

    // backgroundAudio.stop()

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
    city2.getMarker().visible = true
  })

  event.onStop(() => {
    eventCountry.sky.visible = false
    eventCountry.terrain.visible = false
    countryMesh.visible = false
    light.visible = false

    city1.getMarker().visible = false
    city2.getMarker().visible = false
  })

  event.onUpdate(() => {
    eventCountry.update()
    ripple1.update(ripple1Data.getAverageFrequency())
    ripple1_2.update(ripple1_2Data.getAverageFrequency())
    ripple2.update(ripple2Data.getAverageFrequency())
    ripple2_2.update(ripple2_2Data.getAverageFrequency())
    ripple3.update(ripple3Data.getAverageFrequency())

    ripple2_2_Text.update()
  })

  event.onRenderDom(() => {
    ripple2_2_Text.setEventText(
      'All people in this region are extremely dehyrated and starving, <b>every second</b>.',
      `The South-East portion of Ethiopia is extremely impoverished. The extreme heat from
      its neighbouring oceans causes severe drought, loss of crops and farm animals. As a result, this entire
      region is under a famine.`)
  })


  return event
}
