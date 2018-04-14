import * as React from 'react'
import { Pond } from '../Pond/Pond'
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

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  private svgContainer: any

  componentDidMount() {
    if (this.svgContainer) {
      RootComponent.setContainer(this.svgContainer)
      RootComponent.addSections([
        PondScene,
      ])

      // set default scene using switchScene method
      RootComponent.switchScene('pondScene')
        .then(() => {
          RootComponent.switchSceneChangeOn()
          document.addEventListener('mousemove', RootComponent.handleMouseMove, false)
          document.addEventListener('mousedown', RootComponent.handleMouseDown, false)
          document.addEventListener('mouseup', RootComponent.handleMouseUp, false)
        })

      RootEvent.eventOn('sectionChangeStart', (scene) => {
        const { to, from } = scene

        if (to === 'pondScene') {
          PondScene.in()
          PondScene.start()
        }

        if (from === 'pondScene') {
          PondScene.out()
          PondScene.stop()
        }
      })
    }
  }

  public render() {
    return (
      <main>

        <div
          style={{
            position: 'absolute' as 'absolute',
            width: window.innerWidth,
            height: window.innerHeight,
            zIndex: 999,
            top: 0,
            left: 0,
          }}
        >
          <h2 id={'switch'} style={{
            color: 'white',
            left: '300px',
          }}>Switch Scenes</h2>
        </div>

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
