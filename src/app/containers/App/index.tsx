import * as React from 'react'
import {
  EthiopiaEvent,
  PeurtoRicoEvent,
  Pond,
  SyriaEvent,
  Welcome,
} from '../Scenes'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers'
import { bindActionCreators } from 'redux'
import {
  Event,
  isDev,
  Root,
} from '../../components'
import * as style from './style.css'

if (!isDev) {
  window.console.warn('😃 Hello! Check out my work @ nikunj.ca :)')
  window.console.log = () => {}
  window.console.error = () => {}
}

window.console.warn = () => {}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

const mapStateToProps = (state: RootState) => {
  return {
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
    backButtonHover: boolean,
    isTransitioningStart: boolean,
    isTransitioningSuccess: boolean,
    currentScene: string,
    text: any
  }
}

export const RootComponent = new Root()
export const RootEvent = new Event()

export const PondScene = Pond()
export const WelcomeScene = Welcome()

// Events
export const SyriaEventScene = SyriaEvent()
export const PeurtoRicoEventScene = PeurtoRicoEvent()
export const EthiopiaEventScene = EthiopiaEvent()

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      backButtonHover: false,
      isTransitioningStart: false,
      isTransitioningSuccess: true,
      currentScene: '',
      text: [],
    }
  }

  private svgContainer: any
  private transitionId: any

  componentDidMount() {
    if (this.svgContainer) {
      RootComponent.setContainer(this.svgContainer)
      RootComponent.addScenes([
        WelcomeScene,
        PondScene,
        SyriaEventScene,
        PeurtoRicoEventScene,
        EthiopiaEventScene,
      ])

      RootComponent.setDefaultScreen('peurtoRicoEvent')
      // RootComponent.backToEvent = true
      RootEvent.eventOn('sceneChangeStart', (scene) => {
        const { to, from } = scene

        if (to === null && from == null || to === from) {
          return
        }

        this.setState({
          currentScene: to,
        })

        if (to === 'welcomeScene') {
          WelcomeScene.in()
          WelcomeScene.start()
        } else if (to === 'pondScene') {
          PondScene.in()
          PondScene.start()
        } else if (to === 'syriaEvent') {
          SyriaEventScene.in()
          SyriaEventScene.start()
        } else if (to === 'peurtoRicoEvent') {
          PeurtoRicoEventScene.in()
          PeurtoRicoEventScene.start()
        } else if (to === 'ethiopiaEvent') {
          EthiopiaEventScene.in()
          EthiopiaEventScene.start()
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
        } else if (from === 'peurtoRicoEvent') {
          PeurtoRicoEventScene.out()
          PeurtoRicoEventScene.stop()
        } else if (from === 'ethiopiaEvent') {
          EthiopiaEventScene.out()
          EthiopiaEventScene.stop()
        }
      })
      window.addEventListener('resize', RootComponent.handleWindowResize, false)
      document.addEventListener('mousemove', RootComponent.handleMouseMove, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sceneData) {
      this.setState({
        isTransitioningStart: nextProps.sceneData.isTransitioning,
        isTransitioningSuccess: false,
      }, () => {
        this.transitionId = setTimeout(() => {
          this.setState({ isTransitioningSuccess: true })
        }, RootComponent.sceneTransitionTime / 2)
      })
    }
  }

  componentWillUnmount() {
    if (this.transitionId) {
      clearTimeout(this.transitionId)
    }
  }

  private renderRippleDom = (event) => {
    return (
      <div>
        <div className={style.header}>
          <div className={style.backButtonContainer}>
            <button
              className={style.backButton}
              onMouseOver={() => this.setState({ backButtonHover: true })}
              onMouseOut={() => this.setState({ backButtonHover: false })}
              onClick={() => {
                RootComponent.backToEvent = true
                RootComponent.switchScreen(event.from, 'pondScene')
              }}>
              <img src="../../../assets/images/back-icon.png"/>
            </button>
            <span
              style={{
                opacity: this.state.backButtonHover ? 1 : 0,
              }}
              className={style.backButtonText}>Back To Pond</span>
          </div>
          <div className={style.headerTitleContainer}>
            <h2>{event.name}</h2>
            <span><b>{event.description}</b>: {event.information}</span>
          </div>
        </div>
      </div>
    )
  }

  private renderDOMByScene = () => {
    if (this.state.currentScene === 'syriaEvent') {
      return this.renderRippleDom(
        {
          from: 'syriaEvent',
          name: 'Syria',
          description: 'March 2011',
          information: 'since the outbreak of the Syrian Civil War, millions have been horribly affected.',
        },
      )
    } else if (this.state.currentScene === 'peurtoRicoEvent') {
      return this.renderRippleDom(
        {
          from: 'peurtoRicoEvent',
          name: 'Puerto Rico',
          description: 'September 2017',
          information: 'Hurricane Maria struck the island leaving it without power and resources.',
        },
      )
    } else if (this.state.currentScene === 'ethiopiaEvent') {
      return this.renderRippleDom(
        {
          from: 'ethiopiaEvent',
          name: 'Ethiopia',
          description: 'March 2017',
          information: 'millions of men, women and children are enduring severe starvation.',
        },
      )
    }
    return null
  }

  public render() {
    return (
      <main>
        {this.renderDOMByScene()}
        <div
          className={style.sceneFadeDiv}
          style={{
            zIndex: this.state.isTransitioningStart
              ? 999
              : this.state.isTransitioningSuccess ? -999 : 999,
            opacity: this.state.isTransitioningStart ? 1 : 0,
          }}
        />
        <div id={'renderSceneDOM'}/>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
          ref={node => this.svgContainer = node}
        />
      </main>
    )
  }
}

export default App
