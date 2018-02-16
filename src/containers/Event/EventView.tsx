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
  location: any,
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
class EventContainer extends React.Component<Props, State> {
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

  /* Video */
  private video: any
  private videotexture: any
  private videocanvasctx: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      location: props.location.state.event || null,
      loading: true,
      client: {
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
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
    if (this.state.location) {
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

  private createPoint = (position: { x: number, y: number, z: number }, type: string, name?: string, color?: string | number): any => {
    let geometry
    switch (type.toLowerCase()) {
      case 'capital':
        geometry = new THREE.TorusGeometry(0.05, 0.002, 100, 100)
        break
      default:
        geometry = new THREE.TorusGeometry(0.025, 0.002, 100, 100)
        break
    }

    const material = new THREE.MeshBasicMaterial({
      color: color || '#d3d3d3',
      wireframe: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.geometry.name = name
    mesh.position.z = position.z
    mesh.position.x = position.x
    mesh.position.y = position.y
    mesh.up = new THREE.Vector3(0, 12, 2)

    return mesh
  }

  private createText = (position: { x: number, y: number, z: number }, size: number, value: string, color?: string | number): any => {
    const text = new THREE.TextSprite({
      textSize: size,
      redrawInterval: 1000000,
      texture: {
        text: value,
        fontFamily: 'Lora, Times New Roman, serif',
        fontWeight: '400'
      },
      material: {
        color,
      },
    })

    text.name = value
    text.position.x = position.x
    text.position.y = position.y
    text.position.z = position.z

    return text
  }

  public renderMap = () => {
    const meshData = this.svgMesh3d(Damascus)

    // Physical Map
    this.mapGeometry = this.createGeometry(meshData)
    this.mapMaterial = new THREE.MeshBasicMaterial({
      color: '#b7b7b7',
      side: THREE.DoubleSide
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

    // Ambient Light
    const light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    /*
    *
    * Hard coding events for now
    * TODO: Not hard code these events
    *
    *
    * */

    const setZPosition = this.mapMesh.position.z + 0.01

    if (this.props) {
      if (!isNullOrUndefined(this.state.location.geo.city)) {
        // Capital City Marker & Text
        const capitalCity = this.createPoint({
          x: -0.7,
          y: -0.3,
          z: setZPosition
        }, 'Capital', this.state.location.geo.city, '#000000')
        this.scene.add(capitalCity)

        const capitalCityText = this.createText({
          x: capitalCity.position.x + 0.15,
          y: capitalCity.position.y,
          z: setZPosition
        }, 0.03, this.state.location.geo.city, 0x000000)
        // this.scene.add(capitalCityText)
      }
    }

    // Event 1 Marker
    const event1Marker = this.createPoint({
      x: -0.8,
      y: -0.5,
      z: setZPosition
    }, 'event', 'Event 1', '#7e7e7e')
    this.scene.add(event1Marker)

    // Statistical Text

    const statisticalText = document.createElement('div')
    const people = Math.round((Math.random() + 2) * 1 * Math.random())
    const deaths = Math.round((Math.random() + 2) * 2 * Math.random())
    const sounds = Math.round((Math.random() + 30) * 6 * Math.random())
    statisticalText.innerHTML = '<div style="display:flex;justify-content:space-between;flex-direction: column;text-align: right">' +
      '<div>Since clicking this event:</div>' +
      '<div><span style="color:#b73921;font-weight:700">' + people + ' people have been displaced</span></div>' +
      '<div><span style="color:#b73921;font-weight:700">' + deaths + ' people have passed</span></div>' +
      '<div><span style="color:#b73921;font-weight:700">' + sounds + ' sounds have been heard</span></div>' +
      '</div>'
    statisticalText.style.position = 'absolute'
    statisticalText.style.right = '20px'
    statisticalText.style.bottom = '100px'
    document.getElementById('event').appendChild(statisticalText)

  }

  private mouseMoveEvents = () => {
    /* Mouse Events */
    if (this.scene.children && !isNullOrUndefined(this.state.location.geo.city)) {
      const vector = new THREE.Vector3(this.state.mouse.x, this.state.mouse.y, 1).unproject(this.camera)
      const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())
      const intersections = raycaster.intersectObjects(this.scene.children)

      if (intersections.length) {

        // TODO: Figure out how to reset colours back automatically
        // TODO: Figure out how to hover over any ripple/event
        // TODO: Implement LoadingManager

        // Capital Marker Check
        const capitalMarker = intersections.filter(inter => {
          if (inter.object.geometry) {
            return inter.object.geometry.name === this.state.location.geo.city
          }
          return null
        })

        //Event1 Marker Check
        const event1Marker = intersections.filter(inter => {
          if (inter.object.geometry) {
            return inter.object.geometry.name === 'Event 1'
          }
          return null
        })

        // Event1 Audio
        const listener = new THREE.AudioListener()
        this.camera.add(listener)

        const sound = new THREE.Audio(listener)
        const audioLoader = new THREE.AudioLoader()

        if (capitalMarker.length) {
          window.document.body.style.cursor = 'pointer'
          capitalMarker[0].object.material.color.setHex(0xb73921)

          // Uncomment if you add Capital City Name back (1/2)
          // const match = this.scene.children.filter(child => child.name === this.state.location.geo.city)[0]
          // match.material.color.setHex(0xb73921)

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

          const DamascusPath1Geometry = this.createPoint({
            x: -0.7,
            y: -0.3,
            z: 2.55
          }, 'event', 'DamascusPath1Geometry', '#2da750')

          this.scene.add(DamascusPath1Geometry)

          // DamascusPath1 text
          if (!document.getElementById('path1Text')) {
            const path1Text = document.createElement('div')
            path1Text.id = 'path1Text'

            const timer = `50 days, 24 hours, 60 minutes remain until freedom`
            path1Text.innerHTML = '<div style="display:flex;justify-content:space-between;">' +
              '<button onclick="this.sound.stop()">Pause</button>' +
              '<div style="padding: 7px 8px"><span style="color:#b73921;font-weight:700">2,973,960 Footsteps to Serbia</span><br />' + timer + '</div>' +
              '</div>'
            path1Text.style.position = 'absolute'
            path1Text.style.left = '550px'
            document.getElementById('event').appendChild(path1Text)
          }

          audioLoader.load(process.env.PUBLIC_URL + 'media/syria_damascus/walking_audio.mp3', buffer => {
            sound.setBuffer(buffer)
            sound.setLoop(true)
            sound.setVolume(0.3)
            sound.play()
          })

          // Animate DamascusPath1 via TWEEN
          // meshPath.scale.y = 0
          // const tween = new TWEEN.Tween(meshPath.scale)
          //   .to({y: 0.6}, 2000)
          //   .easing(TWEEN.Easing.Quadratic.InOut)
          //
          // if (!tween.isPlaying()) {
          //   tween.start()
          // }
        }

        if (event1Marker.length) {
          window.document.body.style.cursor = 'pointer'
          event1Marker[0].object.material.color.setHex(0xb73921)
          const eventMarkerRegionTitle = this.createText({
            x: -0.4,
            y: -0.5,
            z: 2.56,
          }, 0.03, 'Syrian regime bombs civilians in Eastern Ghouta.', 0xb73921)
          // this.scene.add(eventMarkerRegionTitle)

          const event1Text = document.createElement('div')
          event1Text.id = 'event1Text'

          event1Text.innerHTML = '<div style="display:flex;justify-content:space-between;">' +
            '<button onclick="this.sound.stop()">Pause</button>' +
            '<div style="padding: 7px 8px"><span style="color:#b73921;font-weight:700">Syrian regime bombs civilians in Eastern Ghouta</span><br />' +
            '<span>A child\'s scream generally reaches 115 decibels. A bomb exploding reaches 240 - 280 decibels.</span>' + '</div>' +
            '</div>'
          event1Text.style.position = 'absolute'
          event1Text.style.left = '450px'
          event1Text.style.bottom = '230px'
          document.getElementById('event').appendChild(event1Text)

          this.video = document.createElement('video')
          this.video.src = process.env.PUBLIC_URL + 'media/syria_damascus/video.ogv'
          this.video.volume = 0
          this.video.load()
          this.video.play()

          const videocanvas = document.createElement('canvas')
          videocanvas.width = 640
          videocanvas.height = 480

          this.videocanvasctx = videocanvas.getContext('2d')
          this.videocanvasctx.fillStyle = '#b7b7b7'
          this.videocanvasctx.fillRect(0, 0, 640, 480)

          this.videotexture = new THREE.VideoTexture(videocanvas)
          this.videotexture.minFilter = THREE.LinearFilter
          this.videotexture.maxFilter = THREE.LinearFilter

          const imageTexture = new THREE.TextureLoader()
          .setCrossOrigin('')
          .load(process.env.PUBLIC_URL + 'media/syria_damascus/image_small.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(1, 1)
            // texture.offset.x = 100

            // const material = new THREE.MeshBasicMaterial({
            const material = new THREE.SpriteMaterial({
              // map: this.videotexture,
              map: texture,
              side: THREE.DoubleSide,
            })
            const sprite = new THREE.Sprite(material)
            sprite.position.z = 2.57
            sprite.position.x = -0.25
            sprite.position.y = 0.05
            this.scene.add(sprite)
            // this.mapMesh = new THREE.Mesh(this.mapGeometry, material)
            // this.mapMesh.position.z = 2.56
            // this.scene.add(this.mapMesh)
          })
        } else {
          window.document.body.style.cursor = 'default'

          // Uncomment if you add Capital City Name back (2/2)
          // const match = this.scene.children.filter(child => child.name === this.state.location.geo.city)[0]
          // match.material.color.setHex(0x000000)
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
      const moveRate = 0.00009
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

    if (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videocanvasctx.drawImage(this.video, 0, 0)
      if (this.videotexture) {
        this.videotexture.needsUpdate = true
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
            this.state.location.ripples.map((ripple, index) => {
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
                position: 'absolute',
                left: 30,
                top: -15,
              }}
              onClick={this.goBack}
            >Back To Pond
            </button>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'column',
                right: 30,
                width: 300,
              }}
            >
              <h1>{this.state.location.geo.map}</h1>
              <span style={{marginTop: 30}}>{this.state.location.description}</span>
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
      <div
        id={'event'}
        className={styles.eventOverlayContainer}
      >
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
