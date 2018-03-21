import * as React from 'react'
import {withRouter} from 'react-router'
import styles from './EventStyles'
// import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
// import * as Tone from 'tone'
// import * as d3 from 'd3'
import * as CloseIcon from './closeicon.png'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

import 'three/water'
import 'three/sky'
import 'three/canvasRenderer'

// Temporarily
import {data} from '../../../public/data.js'
import * as water from '../../../public/waternormals.png'
import * as cello_a4 from '../../../public/media/syria_damascus/cello_A4.mp3'
import * as viola_c5 from '../../../public/media/syria_damascus/viola_C5.mp3'
import * as violin_as4 from '../../../public/media/syria_damascus/violin_As4.mp3'
import * as cello_d4 from '../../../public/media/syria_damascus/cello_D4.mp3'
import * as cello_d2 from '../../../public/media/syria_damascus/cello_D2.mp3'
import * as drone from '../../../public/media/drone_01_sound.mp3'
import * as drone2 from '../../../public/media/drone_02_sound.mp3'
import * as atmosphericDrone from '../../../public/media/atmosphereic_drone_03.wav'
import {list} from "postcss";

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  event: any,
}

interface State {
  mouseOver: boolean
  lastHoveredObj: any
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    event: state.eventActive,
    ripple: state.eventRippleActive
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class EventContainer extends React.Component<Props, State> {
  // svg setup
  private svgContainer: any

  //three setup
  private _scene: THREE.Scene
  private _camera: THREE.PerspectiveCamera
  private _renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private _material: THREE.MeshBasicMaterial
  private _circle: THREE.Mesh
  private _mouse: THREE.Vector2
  private _raycaster: THREE.Raycaster

  // audio
  private _audioLoader = THREE.AudioLoader
  private _listener = THREE.AudioListener
  private _droneSound = THREE.PositionalAudio
  private _audioAnalyzer = THREE.AudioAnalyser

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouseOver: false,
      lastHoveredObj: null
    }

    // three setup
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 1000)
    this._renderer = new THREE.WebGLRenderer({antialias: true})
    this._light = new THREE.DirectionalLight(0xffffff, 1.0)
    this._material = new THREE.MeshBasicMaterial({
      color: 0x252A4D,
    })
    this._circle = new THREE.Mesh(new THREE.TorusGeometry(2, 0.5, 8, 100, 6.3), this._material)
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()

    // audio
    this._audioLoader = new THREE.AudioLoader()
    this._listener = new THREE.AudioListener()
    this._droneSound = new THREE.PositionalAudio(this._listener)
    this._audioAnalyzer = new THREE.AudioAnalyser(this._droneSound, 32)
  }

  componentDidMount() {
    this.init()

    const stat = [
      {
        id: 1,
        sound: cello_d4,
        type: 'Test',
        interval: 3000
      }
    ]

    stat.forEach(q => {
      this.generateRipples(q).start()
    })

    // // interval sound
    // this._audioLoader.load(cello_a4, buffer => {
    //   this._droneSound.setBuffer(buffer)
    //   this._droneSound.setRefDistance(20)
    //   // this._droneSound.setLoop(true)
    //   this._droneSound.setVolume(10)
    //   // setInterval(() => {
    //   //   this._droneSound.play()
    //   // }, 2000)
    // })
  }

  public generateRipples = (stat?): any => {
    // ripple setup
    const circle = new THREE.Mesh(new THREE.TorusGeometry(10, 0.5, 8, 100, 6.3), new THREE.MeshBasicMaterial({
      color: 0x252A4D
    }))
    this._scene.add(circle)
    // audio setup
    const listener = new THREE.AudioListener()
    const audioLoader = new THREE.AudioLoader()
    const sound = new THREE.PositionalAudio(listener)
    const analyzer = new THREE.AudioAnalyser(sound, 32)

    this._camera.add(listener)

    const start = () => audioLoader.load(cello_d2, buffer => {
      sound.setBuffer(buffer)
      sound.setRefDistance(20)
      sound.setVolume(10)
      setInterval(() => {
        sound.play()
      }, stat.interval)
    })

    const stop = () => {
      // clear interval, stop audio
    }

    const handleMouseMove = (event): void => {
      this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      this._raycaster.setFromCamera(this._mouse, this._camera)
      const intersects = this._raycaster.intersectObject(circle)

      if (intersects.length) {
        document.body.style.cursor = 'pointer'
        this.setState({lastHoveredObj: intersects[0]})
        // this.scaleAnimation(this.state.lastHoveredObj.object)
      } else {
        document.body.style.cursor = 'default'
        if (this.state.lastHoveredObj) {
          console.log('test')
        }
      }
    }

    const animate = () => {
      const offset = analyzer.getAverageFrequency()
      console.log(offset);
      if (offset) {
        new TWEEN.Tween(circle.scale)
        .to({
          x: offset / 30 > 1 ? offset / 30 : 1,
          y: offset / 30 > 1 ? offset / 30 : 1,
          z: offset / 30 > 1 ? offset / 30 : 1
        }, 50)
        .onComplete(() => {
          new TWEEN.Tween(circle.scale)
          .to({
            x: 1,
            y: 1,
            z: 1
          }, 100)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      }
    }

    return {
      start: () => start(),
      stop: () => stop(),
      handleMouseMove: () => handleMouseMove,
      animate: () => animate(),
    }
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor(0x191D3E)
    this.svgContainer.appendChild(this._renderer.domElement)
    this._light.position.set(100, 100, 100)
    this._scene.add(this._light)
    // this._scene.add(this._circle)
    this._camera.position.x = 0
    this._camera.position.y = 0
    this._camera.position.z = 100
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    // this._camera.add(this._listener)
  }

  public animate = (): void => {
    requestAnimationFrame(this.animate)
    this._render()
    this.generateRipples().animate()
    // this.manipulateShape()
    TWEEN.update()
  }

  public manipulateShape = (): void => {
    const offset = this._audioAnalyzer.getAverageFrequency()
    if (offset) {
      new TWEEN.Tween(this._circle.scale)
      .to({
        x: offset / 30 > 1 ? offset / 30 : 1,
        y: offset / 30 > 1 ? offset / 30 : 1,
        z: offset / 30 > 1 ? offset / 30 : 1
      }, 50)
      .onComplete(() => {
        new TWEEN.Tween(this._circle.scale)
        .to({
          x: 1,
          y: 1,
          z: 1
        }, 100)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      })
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
    }
  }

  private _render = (): void => {
    this._renderer.render(this._scene, this._camera)
  }

  private init = (): void => {
    this.createScene()
    this.animate()

    document.addEventListener('mousemove', this.generateRipples().handleMouseMove())
  }

  public handleMouseMove = (event): void => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._raycaster.setFromCamera(this._mouse, this._camera)
    const intersects = this._raycaster.intersectObject(this._circle)

    if (intersects.length) {
      document.body.style.cursor = 'pointer'
      this.setState({lastHoveredObj: intersects[0]})
      this.scaleAnimation(this.state.lastHoveredObj.object)
    } else {
      document.body.style.cursor = 'default'
      if (this.state.lastHoveredObj) {
        new TWEEN.Tween(this.state.lastHoveredObj.object.scale)
        .to({x: 1.0, y: 1.0, z: 1.0}, 200)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      }
    }
  }

  private scaleAnimation = (object): void => {
    new TWEEN.Tween(object.scale)
    .to({x: 1.1, y: 1.1, z: 1.1}, 200)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
  }


  public render() {
    // FIX THIS AFTER
    const _event = data[0]
    return (
      <div style={styles.event}>
        <header style={styles.header}>
          <button
            onMouseOver={() => this.setState({mouseOver: true})}
            onMouseOut={() => this.setState({mouseOver: false})}
            style={{
              transform: this.state.mouseOver ? 'scale(1)' : 'scale(0.8)',
              cursor: this.state.mouseOver ? 'pointer' : 'normal',
              ...styles.close
            }}
          >
            <img src={CloseIcon}/>
          </button>
          <h1 style={styles.geoText}>
            {_event.properties.geo.location}, {_event.properties.geo.map}
          </h1>
          <span style={styles.description}>
            {_event.properties.description}
          </span>
        </header>

        <div
          style={styles.svgContainer}
          ref={node => this.svgContainer = node}
        />

      </div>
    )
  }
}

export default withRouter(EventContainer)
