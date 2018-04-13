import * as React from 'react'
import * as actions from '../../actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RootState } from '../../reducers'
import { TextGeometry } from '../../components/TextGeometry'
import {
  BackgroundParticles,
  EventParticles,
} from '../../components'
import { Scene } from '../../components/Scene'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export const Pond = () => {
  const pondScene = new Scene('pondScene')
  const mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(20, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  )
  pondScene.add(mesh)

  return pondScene
}
