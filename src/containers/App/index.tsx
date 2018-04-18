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

const THREE = require('three')

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
    isTransitioning: boolean,
    currentScene: string
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
      currentScene: '',
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

      RootComponent.setDefaultScreen('welcomeScene')
      RootEvent.eventOn('sceneChangeStart', (scene) => {
        const { to, from } = scene

        if (to === null && from == null || to === from) {
          return
        }

        this.setState({
          currentScene: to,
        })

        if (to === 'welcomeScene') {
          RootComponent.getCamera().position.set(0, 2000, 300)
          WelcomeScene.in()
          WelcomeScene.start()
        } else if (to === 'pondScene') {
          RootComponent.getCamera().position.set(0, 0, 300)
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

  private renderDOMByScene = () => {
    if (this.state.currentScene === 'syriaEvent') {
      return (
        <div>
          <div className={style.header}>
            <button
              className={style.backButton}
              onClick={() => {
                RootComponent.backToEvent = true
                RootComponent.switchScreen('syriaEventScene', 'pondScene')
              }}>
              Back
            </button>
            <div className={style.headerTitleContainer}>
              <h2>Syria</h2>
              <h4>Catastrophe as a result of the civil war</h4>
            </div>
            <div>Sd</div>
          </div>
          <div className={style.footer}>
            <div style={{
              color: '#E0E0E0',
              borderTopColor: '#E0E0E0',
            }}>One person becomes a refugee in this region every two seconds</div>
            <div style={{
              color: '#8cafc9',
              borderTopColor: '#8cafc9',
            }}>One civilian perishes in this region every five seconds
            </div>
          </div>
        </div>
      )
    } else if (this.state.currentScene === 'pondScene') {
      return (
        <div>
          <div className={style.header}>
            <button
              className={style.backButton}
              onClick={() => {
                RootComponent.switchScreen('pondScene', 'welcomeScene')
                RootComponent.getCamera().position.set(0, 0, 300)
              }}>
              Back
            </button>
            <div className={style.headerTitleContainer}>
              <h2>Syria</h2>
              <h4>Catastrophe as a result of the civil war</h4>
            </div>
            <div>Sd</div>
          </div>
          <div className={style.footer}>
            <div style={{
              color: '#E0E0E0',
              borderTopColor: '#E0E0E0',
            }}>One person becomes a refugee in this region every two seconds</div>
            <div style={{
              color: '#8cafc9',
              borderTopColor: '#8cafc9',
            }}>One civilian perishes in this region every five seconds
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  public render() {
    return (
      <main>
        {this.renderDOMByScene()}
        {/*<div*/}
          {/*className={style.sceneFadeDiv}*/}
          {/*style={{*/}
            {/*zIndex: this.state.isTransitioning ? 999 : -999,*/}
            {/*opacity: 1,*/}
          {/*}}*/}
        {/*/>*/}
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
