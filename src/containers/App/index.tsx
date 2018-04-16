import * as React from 'react'
import {
  Pond,
  SyriaEvent,
  Welcome,
} from '../Scenes'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers/index'
import { bindActionCreators } from 'redux'
import {
  Event,
  Root,
} from '../../components'

import * as style from './style.css'

const mapDispatchToProps = (dispatch: any) => {
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

export namespace App {
  export interface Props {
    actions?: typeof actions,
    mouseData?: any,
    sceneData?: any
  }

  export interface State {
    isTransitioning: boolean
  }
}

export const RootComponent = new Root()
export const RootEvent = new Event()

export const PondScene = Pond()
export const WelcomeScene = Welcome()

// Events
export const SyriaEventScene = SyriaEvent()

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      isTransitioning: false,
    }
  }

  private svgContainer: any

  componentDidMount() {
    if (this.svgContainer) {
      RootComponent.setContainer(this.svgContainer)
      RootComponent.addScenes([
        WelcomeScene,
        PondScene,
        SyriaEventScene,
      ])

      RootComponent.setDefaultScreen('syriaEvent')
      RootEvent.eventOn('sceneChangeStart', (scene) => {
        const { to, from } = scene

        if (to === null && from == null) {
          return
        }

        if (to === 'welcomeScene') {
          WelcomeScene.in()
          WelcomeScene.start()
        } else if (to === 'pondScene') {
          PondScene.in()
          PondScene.start()
        } else if (to === 'syriaEvent') {
          SyriaEventScene.in()
          SyriaEventScene.start()
        }

        if (from === 'welcomeScene') {
          WelcomeScene.out()
          WelcomeScene.stop()
        } else if (from === 'pondScene') {
          PondScene.out()
          PondScene.stop()
        } else if (from === 'syriaEvent') {
          SyriaEventScene.out()
          SyriaEventScene.stop()
        }
      })

      document.addEventListener('mousemove', RootComponent.handleMouseMove, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isTransitioning: nextProps.sceneData.isTransitioning })
  }

  public render() {
    return (
      <main>
        <div
          className={style.sceneFadeDiv}
          style={{
            zIndex: this.state.isTransitioning ? 999 : -999,
            opacity: 1
          }}
        />
        <div
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            overflow: 'hidden',
          }}
          ref={node => this.svgContainer = node}
        />
      </main>
    )
  }
}

export default App
