import * as React from 'react'
import * as actions from '../../actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RootState } from '../../reducers'
import {
  BackgroundParticles,
  EventParticles,
  Scene,
  TextGeometry
} from '../../components'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export const Pond = () => {
  const pondScene = new Scene('pondScene')

  const titleText = new TextGeometry({
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
  pondScene.add(titleText.el)

  const light = new THREE.AmbientLight(0xFFFFFF, 25)
  pondScene.add(light)

  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(20, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
  )
  sphere.name = 'sphere'
  sphere.clickable = true
  sphere.visible = false

  pondScene.add(sphere)

  pondScene.onIn(() => {
    titleText.in()
  })

  pondScene.onOut(() => {
    titleText.out()
  })

  pondScene.onStart(() => {
    sphere.visible = true
  })

  pondScene.onStop(() => {
    sphere.vislble = false
  })

  return pondScene
}
