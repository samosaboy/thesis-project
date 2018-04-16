import * as React from 'react'
import {
  Pond,
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
  }
}

export const RootComponent = new Root()
export const RootEvent = new Event()

export const PondScene = Pond()
export const WelcomeScene = Welcome()

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  private svgContainer: any

  componentDidMount() {
    if (this.svgContainer) {
      RootComponent.setContainer(this.svgContainer)
      RootComponent.addSections([
        WelcomeScene,
        PondScene,
      ])

      RootComponent.setDefaultScreen('pondScene')
      RootEvent.eventOn('sectionChangeStart', (scene) => {
        const { to, from } = scene

        if (to === 'welcomeScene') {
          WelcomeScene.in()
          WelcomeScene.start()
        } else if (to === 'pondScene') {
          PondScene.in()
          PondScene.start()
        }

        if (from === 'welcomeScene') {
          WelcomeScene.out()
          WelcomeScene.stop()
        } else if (from === 'pondScene') {
          PondScene.out()
          PondScene.stop()
        }
      })

      document.addEventListener('mousemove', RootComponent.handleMouseMove, false)
    }
  }

  public render() {
    return (
      <main>
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
