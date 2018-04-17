import {
  Country,
  Scene,
} from '../../components'

import * as Tone from 'tone'

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

  /* Background Sound */
  Tone.Transport.bpm.value = 120
  Tone.Transport.loop = true
  Tone.Transport.loopStart = 0
  Tone.Transport.loopEnd = '128m'
  const backgroundAudio = new Tone.Player({
    url: require('../../public/media/drone_01_sound.mp3'),
    volume: 35,
    fadeIn: 2,
    fadeOut: 2,
    loop: true,
  }).toMaster().sync()

  const bufferPromise = new Promise(resolve => {
    Tone.Buffer.on('load', resolve)
  })

  /* Ripple 1 */
  const geometry = new THREE.TorusGeometry(20, 2, 2, 69)
  const material = new THREE.MeshStandardMaterial({ color: '#a2b0e0' })
  const torus = new THREE.Mesh(geometry, material)
  event.add(torus)

  const audioFile = require(`../../public/media/syria_damascus/cello_A4.mp3`)
  const waveform = new Tone.Waveform(1024)
  const fft = new Tone.FFT(32)
  const freeverb = new Tone.JCReverb(0.9).toMaster()
  const sound = new Tone.Player({
    url: audioFile,
    volume: 20,
    retrigger: false,
    loop: true,
  }).fan(fft, waveform).connect(freeverb).toMaster().sync()

  const loop = new Tone.Loop({
    callback: time => {
      sound.start(time).stop(time + 0.85)
    },
    interval: 2,
    probability: 1
  })

  event.onIn(() => {
    syriaEvent.title.in()
    syriaEvent.description.in()
    syriaEvent.backButton.in()

    /* Audio */
    bufferPromise.then(() => {
      loop.start('+0.2')
      Tone.Transport.start('+0.05')
      backgroundAudio.start()
    })
  })

  event.onOut(() => {
    syriaEvent.title.out()
    syriaEvent.description.out()
    syriaEvent.backButton.out()

    /* Audio */
    loop.dispose()
    backgroundAudio.dispose()
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
