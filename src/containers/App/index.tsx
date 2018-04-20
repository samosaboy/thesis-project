import * as React from 'react'
import {
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
  window.console.warn = () => {}
  window.console.error = () => {}
}

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

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
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
      ])

      RootComponent.setDefaultScreen('syriaEvent')
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

  private renderRippleDom = (event, ripples) => {
    return (
      <div>
        <div className={style.header}>
          <div className={style.backButtonContainer}>
            <button
              className={style.backButton}
              onClick={() => {
                RootComponent.backToEvent = true
                RootComponent.switchScreen(event.from, 'pondScene')
              }}/>
          </div>
          <div className={style.headerTitleContainer}>
            <h2>{event.name}</h2>
            <h4>{event.description}</h4>
          </div>
        </div>
        <div className={style.footer}>
          {
            ripples.map(ripple => {
              return (
                <div
                  key={ripple.id}
                  onMouseOver={(e) => {
                    e.currentTarget.innerHTML = ripple.hoverText
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.innerHTML = ripple.text
                  }}
                  style={{
                    color: ripple.color,
                    borderTopColor: ripple.color,
                    borderTopWidth: 1,
                    borderTopStyle: 'solid',
                  }}>
                  {ripple.text}
                </div>
              )
            })}
          <div className={style.eventInfo}>
            {event.information}
          </div>
        </div>
      </div>
    )
  }

  private renderDOMByScene = () => {
    if (this.state.currentScene === 'pondScene') {
      return null
    } else if (this.state.currentScene === 'syriaEvent') {
      return this.renderRippleDom(
        {
          from: 'syriaEvent',
          name: 'Syria',
          description: 'Description',
          information: 'This is a test',
        }, [
          {
            id: 1,
            text: 'Syria 1',
            hoverText: 'Syria WOO',
            color: '#8cafc9',
          },
          {
            id: 2,
            text: 'Syria 2',
            hoverText: 'Syria WOO',
            color: '#b7c980',
          },
        ],
      )
      // return (
      //   <div>
      //     <div className={style.header}>
      //       <div>
      //         <div className={style.backButtonContainer}>
      //           <button
      //             className={style.backButton}
      //             onClick={() => {
      //               RootComponent.backToEvent = true
      //               RootComponent.switchScreen('syriaEvent', 'pondScene')
      //             }}/>
      //         </div>
      //       </div>
      //       <div className={style.headerTitleContainer}>
      //         <h2>Syria</h2>
      //         <h4>The sounds of March 2012</h4>
      //       </div>
      //     </div>
      //     <div className={style.footer}>
      //       <div
      //         onMouseOver={() => whichElementIsHovered = 'syriaEvent:ripple1'}
      //         onMouseOut={() => whichElementIsHovered = null}
      //         style={{
      //           color: '#E0E0E0',
      //           borderTopColor: '#E0E0E0',
      //         }}>
      //         {
      //           whichElementIsHovered === 'syriaEvent:ripple1'
      //             ? <span>Bob</span>
      //             : <span>One person becomes a refugee in this region every two seconds.</span>
      //         }
      //       </div>
      //       <div style={{
      //         color: '#8cafc9',
      //         borderTopColor: '#8cafc9',
      //       }}>One civilian perishes in this region every five seconds.
      //       </div>
      //       <div style={{
      //         color: '#b7c980',
      //         borderTopColor: '#b7c980',
      //       }}>A person is walking to the nearest safe haven 50,000 steps away.
      //       </div>
      //       <div style={{
      //         borderTop: 'none',
      //         flexGrow: 1.2,
      //       }}>
      //
      //       </div>
      //     </div>
      //   </div>
      // )
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
