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

  pondScene.in = () => {
    console.log('pondScene in')
    titleText.in()
  }

  pondScene.out = () => {
    titleText.out()
  }

  return pondScene
}
