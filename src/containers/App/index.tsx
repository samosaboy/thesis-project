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
export const PeurtoRicoEventScene = PeurtoRicoEvent()
export const EthiopiaEventScene = EthiopiaEvent()

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
        PeurtoRicoEventScene,
        EthiopiaEventScene,
      ])

      RootComponent.setDefaultScreen('ethiopiaEvent')
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
        }  else if (to === 'peurtoRicoEvent') {
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
                  dangerouslySetInnerHTML={{__html: ripple.text}}
                  style={{
                    color: ripple.color,
                    borderTopColor: ripple.color,
                    borderTopWidth: 1,
                    borderTopStyle: 'solid',
                  }} />
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
          description: 'March 2011',
          information: 'March 2011 was the outbreak of the Syrian Civil War, which is still ongoing today.',
        }, [
          {
            id: 1,
            text: 'On average, one person had died as a direct result of the civil war every <b>5 minutes</b>.',
            hoverText: `Although the statistics is not complete, as it is hard to keep track of names, on average one person
            died every 5 minutes in Damascus. Often, deaths would follow a pattern in Syria: daily slaughters in Damascus would propogate
            towards Homs, Aleppo, Daraa and Idlib, where similar events would occur.`,
            color: '#8cafc9',
          },
          {
            id: 2,
            text: 'Every <b>10 seconds</b>, one person in Syria had to make the decision to leave their homes.',
            hoverText: `Refugees have to walk or travel on makeshift boats to neighbouring countries and continents.
            It is estimated that 5 million people (in a country that had 22 million people) have been forced out, with 6.3
            million still inside but displaced from their homes.`,
            color: '#E0E0E0',
          },
          {
            id: 3,
            text: 'A Syrian\'s footstep as they walked their 2253 kilometre journey to Serbia.',
            hoverText: `Horgos, Serbia is 2253 KM away, a journey that that takes approximately 50 days to complete if you were to walk 40 kilometres per day. This is roughly
            the duration of a full-time job. This sound plays every second to represent each footstep for one person.`,
            color: '#b7c980',
          },
        ],
      )
    } else if (this.state.currentScene === 'peurtoRicoEvent') {
      return this.renderRippleDom(
        {
          from: 'peurtoRicoEvent',
          name: 'Puerto Rico',
          description: 'September 2017',
          information: 'Hurricane Maria struck the small island of Puerto Rico which left the country without power and resources.',
        }, [
          {
            id: 1,
            text: 'One person had lost their home due to the flooding <b>every one - two seconds</b>',
            hoverText: `Majority of the island's homes were built on faulty, unstable land. Majority of the homes were also
            built poorly. As a result, homes were easily destroyed and people were displaced.`,
            color: '#e0817d',
          },
          {
            id: 2,
            text: '<b>Every 30 seconds</b>, someone required serious medical attention.',
            hoverText: `Data from the Puerto Rico Institute states that in September 2017, 94 people died per day from the
            impact of the hurricane. In total, the month of September 2887 people died.`,
            color: '#c5c968',
          },
          {
            id: 3,
            text: '<b>Every 15 seconds</b>, a family lost electricity, access to potable water and cell service.',
            hoverText: `Unfortunately, power was not restored until four months later; neither was distribution of potable water
            to survivors. By January 2018, only 65% of the electricity had been restored. Fortunately, 86% of the population had
            access to clean, drinking water.`,
            color: '#67c9b5',
          },
        ],
      )
    } else if (this.state.currentScene === 'ethiopiaEvent') {
      return this.renderRippleDom(
        {
          from: 'ethiopiaEvent',
          name: 'Ethiopia',
          description: 'March 2017',
          information: 'As part of the East African Crisis, Ethiopia is seeing millions of men, women and children in severe starvation.',
        }, [
          {
            id: 1,
            text: '<b>Every 2 - 6 seconds,</b> one person is struggling with a disease as a result of lack of clean water.',
            hoverText: `Lack of clean water results in stomach infections which can lead to diarrhea and other symptoms
            which have negative affects on the people. Unfortunately, clean water is hard to distribute due to budget
            constraints from the government and the United Nations.`,
            color: '#6269e0',
          },
          {
            id: 2,
            text: 'All people in this region are extremely dehyrated and starving, <b>every second</b>.',
            hoverText: `The South-East portion of Ethiopia is extremely impoverished. The extreme heat from
            its neighbouring oceans causes severe drought, loss of crops and farm animals. As a result, this entire
            region is under a famine.`,
            color: '#c970be',
          },
          {
            id: 3,
            text: 'One person in this region is able to get access to food <b>every 20 seconds</b>.',
            hoverText: `Fortunately, some parts of Ethiopia have access to food, water and medications to combat
            the many infections and diseases from the lack of essential resources. `,
            color: '#e05d00',
          },
        ],
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
