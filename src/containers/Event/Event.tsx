import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import {Layer, Stage} from 'react-konva'
import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import Ladda from '../../components/Utils/Ladda/Ladda'
import 'three-examples/modifiers/ExplodeModifier.js'
import 'three-examples/modifiers/TessellateModifier.js'
import '../../../node_modules/three.textsprite/THREE.TextSprite.js'
// import {Easing, Tween} from 'es6-tween'
import { Map } from "../../components"

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

/*
* In case you have to import examples (probably will have to) i.e. :
* import 'three/examples/js/renderers/CanvasRenderer.js'
* */

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  data: any,
}

interface State {
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    data: state.eventActive
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class EventContainer extends React.Component<Props, State> {
  // THREE
  private mount: any
  private scene: any
  private camera: any
  private renderer: any
  private frameId: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouse:{x:0, y:0}
    }
  }

  componentDidMount() {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true})
    this.renderer.setClearColor('#f5f5f5', 0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.camera.position.z = 5
    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  private start = (): void => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  private stop = (): void => {
    cancelAnimationFrame(this.frameId)
  }

  private animate = (): void => {
    this.renderer.render(this.scene, this.camera)
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  private createThreeElement = (): JSX.Element => {
    return (
      <div
        ref={node => this.mount = node}
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    )
  }

  public render() {
    const { geo } = this.props.data.data

    return (
      <div>
        {this.createThreeElement()}
        <Map
          scene={this.scene}
          city={'Damascus'}
        />
      </div>
    )
  }
}

export default withRouter(EventContainer)
