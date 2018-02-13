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
import 'three-examples/modifiers/ExplodeModifier.js'
import 'three-examples/modifiers/TessellateModifier.js'
import '../../../node_modules/three.textsprite/THREE.TextSprite.js'
import {isNullOrUndefined} from 'util'

const THREE = require('three')

/*
* In case you have to import examples (probably will have to) i.e. :
* import 'three/examples/js/renderers/CanvasRenderer.js'
* */

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  event: eventRippleActiveData,
}

interface State {
  loading: Boolean
  client: {
    width: number,
    height: number,
  },
  mouse: {
    x: number,
    y: number,
  }
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
  private box: any
  private mouse: any

  /* Map */
  private mapGeometry: any
  private mapMaterial: any
  private mapMesh: any
  private mapGeometryOutline: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      loading: true,
      client: {
        width: 0,
        height: 0,
      },
      mouse: {
        x: 0,
        y: 0,
      }
    }
  }

  componentDidMount() {
    this.setState({
      client: {
        width: window.innerWidth / 2,
        height: window.innerHeight / 2
      }
    })

    document.addEventListener('mousemove', this.mouseMove, false)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    this.renderer.setClearColor('#f5f5f5', 0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    if (this.mount) {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.mount.clientWidth / this.mount.clientHeight,
        1,
        1000
      )
      this.camera.position.z = 5
      this.mount.appendChild(this.renderer.domElement)
      this.start()

      setTimeout(() => {
        this.renderGrid()
        this.renderMap()
        this.setState({loading: false})
      }, 100)
    }
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  private mouseMove = (event) => {
    this.setState({
      mouse: {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      }
    })
  }

  private renderGrid = () => {
    const grid = new THREE.GridHelper(5, 50)
    grid.position.z = 3
    grid.rotateX(29.85)
    this.scene.add(grid)
  }

  public renderMap = () => {
    const createGeometry = require('three-simplicial-complex')(THREE)
    const svgMesh3d = require('svg-mesh-3d')
    const meshData = svgMesh3d(Damascus)

    // Physical Map
    this.mapGeometry = createGeometry(meshData)
    this.mapMaterial = new THREE.MeshBasicMaterial({
      color: '#b7b7b7',
      side: THREE.BackSide,
    })
    this.mapMesh = new THREE.Mesh(this.mapGeometry, this.mapMaterial)
    this.mapMesh.position.z = 2.55
    this.scene.add(this.mapMesh)

    // Bound Box
    this.box = new THREE.Box3()
    this.box.setFromObject(this.mapMesh)

    this.mapGeometryOutline = createGeometry(meshData)
    const mapOutlineMaterial = new THREE.MeshBasicMaterial({
      color: '#d3d3d3',
      // color: '#d3262b',
      wireframe: true,
    })
    const mapMeshOutline = new THREE.Mesh(this.mapGeometryOutline, mapOutlineMaterial)
    mapMeshOutline.position.z = 2.54
    this.mapGeometryOutline.scale(1.8, 1.8, 1.8)
    this.scene.add(mapMeshOutline)

    /*
    *
    * Hard coding events for now
    * TODO: Not hard code these events
    *
    *
    * */

    const setZPosition = this.mapMesh.position.z + 0.01

    const capitalCityMarkerGeometry = new THREE.TorusGeometry(0.05, 0.002, 100, 100)
    const capitalCityMarkerMaterial = new THREE.MeshBasicMaterial({
      color: '#000000',
      wireframe: true,
    })
    const capitalCityMarkerMesh = new THREE.Mesh(capitalCityMarkerGeometry, capitalCityMarkerMaterial)
    capitalCityMarkerMesh.geometry.name = this.props.location.state.event.geo.city
    capitalCityMarkerMesh.position.z = setZPosition
    capitalCityMarkerMesh.position.x = -0.7
    capitalCityMarkerMesh.position.y = -0.3
    capitalCityMarkerMesh.up = new THREE.Vector3(0, 12, 2)
    this.scene.add(capitalCityMarkerMesh)

    const capitalCityText = new THREE.TextSprite({
      textSize: 0.03,
      redrawInterval: 100000,
      texture: {
        text: this.props.location.state.event.geo.city,
        fontFamily: 'Lora, Times New Roman, serif',
        fontWeight: '400'
      },
      material: {
        color: 0x000000,
      },
    })

    capitalCityText.position.z = setZPosition
    capitalCityText.position.x = capitalCityMarkerMesh.position.x + 0.15
    capitalCityText.position.y = capitalCityMarkerMesh.position.y

    this.scene.add(capitalCityText)
  }

  private mouseMoveEvents = () => {
    /* Mouse Events */
    if (this.scene.children && !isNullOrUndefined(this.props.location)) {
      const vector = new THREE.Vector3(this.state.mouse.x, this.state.mouse.y, 1).unproject(this.camera)
      const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())
      const intersections = raycaster.intersectObjects(this.scene.children)

      if (intersections.length) {

        // TODO: Figure out how to reset colours back automatically
        // TODO: Figure out how to hover over any ripple/event
        // Capital Marker Check
        const capitalMarker = intersections.filter(inter => inter.object.geometry.name === this.props.location.state.event.geo.city)
        let capitalMarkerColor = null
        if (capitalMarker.length) {
          window.document.body.style.cursor = 'pointer'

          capitalMarker[0].object.material.color.setHex(0xffff00)
        } else {
          window.document.body.style.cursor = 'default'
        }

      }
    }
  }

  private start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  private renderScene = () => {
    if (this.box) {
      const moveRate = 0.00000009
      if (this.camera.position.x <= (this.box.max.x / 3) && this.camera.position.x >= (this.box.min.x / 3)) {
        this.camera.position.x += (this.state.mouse.x - this.camera.position.x) * moveRate
      }
      if (this.camera.position.y <= (this.box.max.y / 3) && this.camera.position.y >= (this.box.min.y / 3)) {
        this.camera.position.y += -(this.state.mouse.y - this.camera.position.y) * moveRate
      }
      if ((this.camera.position.x >= (this.box.max.x / 3) || this.camera.position.x <= (this.box.min.x / 3))
        || (this.camera.position.y >= (this.box.max.y / 3) || this.camera.position.y <= (this.box.min.y / 3))) {
        this.camera.translate.x = 0
        this.camera.translate.y = 0
      }
    }
    this.renderer.render(this.scene, this.camera)
  }

  private stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  private animate = () => {
    this.renderScene()
    this.mouseMoveEvents()
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

  /*
  * This renders the hover text for each ripple
  * in the event page
  * */

  private renderRippleText = (): JSX.Element => {
    return (
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
    )
  }

  /*
  * This renders our main ripples for events
  * using Konva
  * */

  private renderRipples = (): any => {
    return (
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
    )
  }

  /*
  * This renders our event page entirely
  * */

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
          {/*{this.renderRippleText()}*/}
          {/*{this.renderRipples()}*/}
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
                zIndex: 999,
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
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          ref={node => this.mount = node}
        />
      </div>
    )
  }
}

export default withRouter(EventContainer)
