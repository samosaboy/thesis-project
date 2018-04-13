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

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export namespace Pond {
  export interface Props {
    actions?: typeof actions,
    camera: THREE.Camera,
    clock: THREE.Clock,
    sceneData?: any
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    mouseData: state.mouseData,
    sceneData: state.sceneData,
  }
}

class Pond extends React.PureComponent<Pond.Props, any> {
  private titleText: any
  private backgroundParticles: any
  private syriaText: any

  constructor(props?: any, context?: any) {
    super(props, context)
    const pondScene = new THREE.Scene()
    pondScene.name = 'pondScene'
    this.titleText = new TextGeometry({
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

    this.titleText.in()
    // this._text1.setName('to:pondScene')
    pondScene.add(this.titleText.mesh)

    this.backgroundParticles = new BackgroundParticles({
      count: 1000,
      particleSize: 1.2,
      rangeY: [
        -200,
        200,
      ],
    })
    pondScene.add(this.backgroundParticles.getElement())

    const eventParticles = new EventParticles()
    eventParticles.in()
    pondScene.add(eventParticles.getElement())

    this.syriaText = new TextGeometry({
      text: 'D A M A S C U S, \n S Y R I A',
      options: {
        align: 'left',
        size: 500,
        lineSpacing: 20,
        font: 'Lato',
        style: 'Bold',
        color: '#FFFFFF',
      },
    })

    // this.props.actions.addToSceneList({ scene: pondScene })
    // this.props.sceneData.currentScene.add(this.syriaText.mesh)
  }

  render() {
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pond)
