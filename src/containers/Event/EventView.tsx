import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import {Layer, Stage} from 'react-konva'
import RippleEventView from './Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import {Damascus, DamascusPath1} from '../../constants/paths'
import Ladda from '../../components/Ladda/Ladda'
import 'three-examples/modifiers/ExplodeModifier.js'
import 'three-examples/modifiers/TessellateModifier.js'
import '../../../node_modules/three.textsprite/THREE.TextSprite.js'
// import {Easing, Tween} from 'es6-tween'
import {isNullOrUndefined} from 'util'

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

  /* Map */
  private mapGeometry: any
  private mapMaterial: any
  private mapMesh: any
  private mapGeometryOutline: any

  /* Geometry */
  private createGeometry: any
  private svgMesh3d: any

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
    this.createGeometry = require('three-simplicial-complex')(THREE)
    this.svgMesh3d = require('svg-mesh-3d')
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
        // this.renderGrid()
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
    const meshData = this.svgMesh3d(Damascus)

    // Physical Map
    this.mapGeometry = this.createGeometry(meshData)
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

    this.mapGeometryOutline = this.createGeometry(meshData)
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

    // Capital City Marker and Text
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
      redrawInterval: 10000000,
      texture: {
        text: this.props.location.state.event.geo.city,
        fontFamily: 'Lora, Times New Roman, serif',
        fontWeight: '400'
      },
      material: {
        color: 0x000000,
      },
    })

    capitalCityText.name = this.props.location.state.event.geo.city
    capitalCityText.position.z = setZPosition
    capitalCityText.position.x = capitalCityMarkerMesh.position.x + 0.15
    capitalCityText.position.y = capitalCityMarkerMesh.position.y
    this.scene.add(capitalCityText)

    // Event 1 Marker
    const event1MarkerGeometry = new THREE.TorusGeometry(0.02, 0.002, 100, 100)
    const event1MarkerMaterial = new THREE.MeshBasicMaterial({
      color: '#595959',
      wireframe: true,
    })
    const event1CityMarkerMesh = new THREE.Mesh(event1MarkerGeometry, event1MarkerMaterial)
    event1CityMarkerMesh.geometry.name = 'Event 1'
    event1CityMarkerMesh.position.z = setZPosition
    event1CityMarkerMesh.position.x = -0.8
    event1CityMarkerMesh.position.y = -0.5
    this.scene.add(event1CityMarkerMesh)

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
        const capitalMarker = intersections.filter(inter => {
          if (inter.object.geometry) {
            return inter.object.geometry.name === this.props.location.state.event.geo.city
          }
          return []
        })

        if (capitalMarker.length) {
          window.document.body.style.cursor = 'pointer'
          capitalMarker[0].object.material.color.setHex(0xb73921)

          const match = this.scene.children.filter(child => child.name === this.props.location.state.event.geo.city)[0]
          match.material.color.setHex(0xb73921)

          // Damascus1 Path
          const meshData = this.svgMesh3d(DamascusPath1)
          const meshGeometry = this.createGeometry(meshData)
          const meshMaterial = new THREE.MeshBasicMaterial({
            color: '#b73921',
            side: THREE.BackSide,
          })
          const meshPath = new THREE.Mesh(meshGeometry, meshMaterial)
          meshPath.scale.multiplyScalar(0.7)
          meshPath.scale.y = 0.6
          meshPath.position.z = 2.55
          meshPath.position.x = -0.65
          meshPath.position.y = 0.3
          this.scene.add(meshPath)

          const path1Text = new THREE.TextSprite({
            textSize: 0.03,
            redrawInterval: 10000000,
            texture: {
              text: '2,973,960 Footsteps to Serbia',
              fontFamily: 'Lora, Times New Roman, serif',
              fontWeight: '400',
              autoRedraw: false
            },
            material: {
              color: 0xb73921,
            },
          })

          path1Text.position.z = 2.55
          path1Text.position.y = 0.85
          path1Text.position.x = -0.40
          this.scene.add(path1Text)

          meshPath.scale.y = 0
          const tween = new TWEEN.Tween(meshPath.scale)
            .to({y: 0.6}, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)

          if (!tween.isPlaying()) {
            tween.start()
          }

        } else {
          window.document.body.style.cursor = 'default'

          const match = this.scene.children.filter(child => child.name === this.props.location.state.event.geo.city)[0]
          match.material.color.setHex(0x000000)
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
      const moveRate = 0.000009
      if (this.camera.position.x <= (this.box.max.x / 3) && this.camera.position.x >= (this.box.min.x / 3)) {
        this.camera.position.x += (this.state.mouse.x - this.camera.position.x) * moveRate
      }
      if (this.camera.position.y <= (this.box.max.y / 3) && this.camera.position.y >= (this.box.min.y / 3)) {
        this.camera.position.y += (this.state.mouse.y - this.camera.position.y) * moveRate
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
    TWEEN.update()
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
              top: 30,
              right: 0
            }}
            className={styles.eventHeader}
          >
            <button
              style={{
                position:'absolute',
                left:30,
                top:-15,
              }}
              onClick={this.goBack}
            >Go Back</button>
            <div
              style={{
                position: 'absolute',
                display:'flex',
                alignItems:'flex-end',
                flexDirection:'column',
                right: 30,
                width: 300,
              }}
            >
              <h1>{this.props.location.state.event.geo.map}</h1>
              <span style={{marginTop:30}}>{this.props.location.state.event.description}</span>
            </div>
          </div>
          {this.renderRippleText()}
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
