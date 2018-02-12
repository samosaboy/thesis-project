import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import {Layer, Stage} from 'react-konva'
import RippleEventView from './Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import {Damascus} from '../../constants/paths'
import Ladda from '../../components/Ladda/Ladda'

import * as THREE from 'three'

// import 'three/examples/js/renderers/CanvasRenderer.js'

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  event: eventRippleActiveData,
}

interface State {
  loading: Boolean
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    event: state.eventRippleActive,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class EventContainer extends React.PureComponent<Props, State> {
  private stage: any
  private layer: any
  private mount: any
  private scene: any
  private camera: any
  private renderer: any
  private frameId: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    this.renderer.setClearColor('#f5f5f5', 0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    if (this.mount) {
      this.camera = new THREE.PerspectiveCamera(
        20,
        this.mount.clientWidth / this.mount.clientHeight,
        0.1,
        1000
      )
      this.camera.position.z = 5
      this.mount.appendChild(this.renderer.domElement)
      this.start()
      // this.renderMap()
      setTimeout(() => {
        this.renderMap()
        setTimeout(() => {
          this.setState({loading: false})
        }, 0)
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  private renderMap = () => {
    const createGeometry = require('three-simplicial-complex')(THREE)
    const svgMesh3d = require('svg-mesh-3d')
    const meshData = svgMesh3d(Damascus)
    const mapGeometry = createGeometry(meshData)
    const mapMaterial = new THREE.MeshBasicMaterial({
      color: '#000000',
      side: THREE.DoubleSide,
    })
    const mapMesh = new THREE.Mesh(mapGeometry, mapMaterial)
    this.scene.add(mapMesh)
    console.log('mapCreated')
  }

  private start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  private renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  private stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  private animate = () => {
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  private goBack = (): void => {
    this.props.history.goBack()
    this.props.actions.eventRippleActive({
      title: null,
      description: null,
      visual: null,
    })
  }

  private renderEvent = () => {
    return (
      <div>
        <div className={styles.eventContainer}>
          <div
            style={{
              width: window.innerWidth,
              top: 0,
              right: 0
            }}
            className={styles.eventHeader}
          >
            <button onClick={this.goBack}>Go Back</button>
            <div style={{textAlign: 'right'}}>
              <h1>{this.props.location.state.event.geo.city}</h1>
              <span>{this.props.location.state.event.description}</span>
            </div>
          </div>
          <div
            className={styles.eventText}
            style={{
              width: window.innerWidth / 3,
              height: window.innerHeight,
              left: window.innerWidth / 2,
              top: 6 + 'em',
              fontSize: 1.8 + 'vw',
            }}>
            <span
              className={styles.header}
              style={{
                fontSize: 2.6 + 'vw',
                lineHeight: 3.6 + 'rem',
              }}
            >
              {this.props.event.title}
            </span>
            <p dangerouslySetInnerHTML={{__html: this.props.event.description}}/>
          </div>
          <Stage
            draggable={false}
            ref={node => this.stage = node}
            className={styles.stage}
            width={window.innerWidth}
            height={window.innerHeight}
            name={'eventStage'}
          >
            <Layer
              draggable={false}
              ref={node => this.layer = node}
              offset={{
                x: -window.innerWidth / 6,
                y: -window.innerHeight / 2,
              }}
            >
              {
                this.props.location.state.event.ripples.map((ripple, index) => {
                  const scale = 200 * (index + 1)
                  const r = scale / 2
                  return (
                    <RippleEventView
                      key={ripple.name + ripple.id}
                      ripple={ripple}
                      radius={r}
                    />
                  )
                })
              }
            </Layer>
          </Stage>
        </div>
      </div>
    )
  }

  public render() {
    return (
      <div className={styles.eventOverlayContainer}>
        {
          this.state.loading ? (
            <div
              style={{
                backgroundColor: 'black',
                position: 'absolute',
                width: window.innerWidth,
                height: window.innerHeight,
                top: 0,
                left: 0,
                zIndex: 999
              }}
            >
              <Ladda isolated={true}/>
            </div>
          ) : this.renderEvent()
        }
        <div
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
          }}
          ref={node => this.mount = node}
        />
      </div>
    )
  }
}

export default withRouter(EventContainer)
