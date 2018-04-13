import * as React from 'react'
import {Pond} from '../Pond/Pond'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers/index'
import { bindActionCreators } from 'redux'
import { Root } from '../../components'

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
    prevObject: any,
    mousemove: boolean,
  }
}

export const RootComponent = new Root()

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  private svgContainer: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      prevObject: {}, // the last object we hovered over
      mousemove: false,
    }
  }

  componentDidMount() {
    // We must put this in cDM because svgContainer DNE until its mounted
    if (this.svgContainer) {
      RootComponent.setContainer(this.svgContainer)
      RootComponent.addSections([
        Pond(),
      ])
      RootComponent.setDefaultScene('pondScene')
        .then(() => RootComponent.animate())
    }

    // document.addEventListener('mousemove', this.handleMouseMove)
    // document.addEventListener('mousedown', this.handleMouseDown)
    // document.addEventListener('mouseup', this.handleMouseUp)
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
