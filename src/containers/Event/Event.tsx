import * as React from 'react'
import {withRouter} from 'react-router'
import styles from './EventStyles'
// import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import * as Tone from 'tone'
import * as d3 from 'd3'
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
  lastHoveredObj: any,
  data: any
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
  private _scene: THREE.Scene | any
  private _camera: THREE.PerspectiveCamera
  private _renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private _mouse: THREE.Vector2
  private _raycaster: THREE.Raycaster
  private _rippleArray: any
  private _bubbleArray: any

  // audio
  private _bufferPromise: any
  private _backgroundSound: Tone.Player

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouseOver: false,
      lastHoveredObj: null,
      data: [
        {
          id: 1,
          sound: cello_d4,
          type: 'Test',
          volume: 0,
          interval: 6
        },
        {
          id: 2,
          sound: cello_d2,
          type: 'Test',
          volume: 0,
          interval: 7.5
        }
      ]
    }

    this._rippleArray = []
    this._bubbleArray = []

    // three setup
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 1000)
    this._renderer = new THREE.WebGLRenderer({antialias: true})
    this._light = new THREE.DirectionalLight(0xffffff, 1.0)
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()

    Tone.Transport.bpm.value = 120
    Tone.Transport.loop = true

    // specify the number of measures
    Tone.Transport.loopStart = 0
    Tone.Transport.loopEnd = '128m'

    // audio
    this._backgroundSound = new Tone.Player({
      url: drone,
      fadeIn: 2,
      fadeOut: 2,
      loop: true,
    }).toMaster().sync()

    this._bufferPromise = new Promise(done => {
      Tone.Buffer.on('load', done)
    })
  }

  componentDidMount() {
    this.init()
  }

  generateRipples = (): any => {
    this.state.data.forEach((stat, i) => {
      // ripple setup
      const circle = new THREE.Mesh(
        new THREE.TorusBufferGeometry(stat.id * 10, 0.5, 8, 100),
        new THREE.MeshPhongMaterial({
          color: 0x4C6F97,
          shading: THREE.FlatShading,
        })
        // new THREE.MeshBasicMaterial({color: 0x252A4D})
      )
      circle.name = `circle-${stat.id}`
      this._scene.add(circle)

      // audio setup
      const waveform = new Tone.Waveform(1024)
      const fft = new Tone.FFT(32)
      const freeverb = new Tone.JCReverb(0.9).toMaster()
      const sound = new Tone.Player({
        url: viola_c5,
        volume: stat.volume,
        retrigger: false,
        loop: true,
      }).fan(fft, waveform).connect(freeverb).toMaster().sync()

      /*
      * The interval is based on the number of beats specified in the constructor
      * I should figure out how fast etc I want my audio
      * */
      const loop = new Tone.Loop({
        callback: time => {
          // Queues for the next event
          sound.start(time).stop(time + 0.85)
        },
        interval: stat.interval,
        probability: 1
      })

      this._bufferPromise.then(() => {
        Tone.Transport.start('+0.1')
        loop.start()
        this._backgroundSound.start()
      })

      this._rippleArray[i] = {
        circle,
        waveform,
      }
    })

    // for (var i = 0; i < 1000; i++) {
    //   var mesh = new THREE.Mesh(new THREE.CircleBufferGeometry(1, 24), new THREE.MeshPhongMaterial({
    //     color: 0x4C6F97
    //   }))
    //   mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 1).normalize();
    //   mesh.position.multiplyScalar(90 + (Math.random() * 100));
    //   this._bubbleArray.push(mesh)
    //   this._scene.add(mesh);
    // }
  }

  generateOcean = () => {

  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor(0x191D3E)
    this.svgContainer.appendChild(this._renderer.domElement)
    this._light.position.set(0, 0, 2)
    this._scene.add(this._light)
    this._camera.position.x = 0
    this._camera.position.y = 0
    this._camera.position.z = 100
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  public animate = (): void => {
    requestAnimationFrame(this.animate)
    this._render()
    this.animateRipple()
    this.animateBubbles()
    TWEEN.update()
  }

  private animateRipple = (): void => {
    Tone.Transport.schedule(() => {
      this._rippleArray.forEach((q, i) => {
        const frequencyData: any = q.waveform.getValue()
        const max: number = parseFloat(d3.max(frequencyData)) * 100
        const object = this._scene.getObjectByName(`circle-${i + 1}`)
        const delta = max > 1 ? 1 * max : 1

        const tween = new TWEEN.Tween(object.scale)
        .to({
          x: delta,
          y: delta,
          // TODO: play with z-position
          z: delta,
        }, 500)
        .easing(TWEEN.Easing.Cubic.Out)

        tween.start()
      })
    })
  }

  private animateBubbles = (): void => {
    if (this._bubbleArray.length) {
      this._bubbleArray.forEach(bubble => {
        // const frequencyData: any = q.waveform.getValue()
        // const max: number = parseFloat(d3.max(frequencyData)) * 100
        bubble.position.x -= Math.random() * 0.0060
        bubble.position.y -= Math.random() * 0.0060
      })
    }
  }

  private handleMouseMove = (event) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._raycaster.setFromCamera(this._mouse, this._camera)

    if (this._rippleArray.length) {
      let intersects = []

      this._rippleArray.forEach(ripple => {
        const raycaster = this._raycaster.intersectObject(ripple.circle)
        if (raycaster.length) {
          intersects = this._raycaster.intersectObject(ripple.circle)
        }
      })

      if (intersects.length) {
        document.body.style.cursor = 'pointer'
        this.setState({lastHoveredObj: intersects[0]})
        const object = this._scene.getObjectByName(this.state.lastHoveredObj.object.name)
        if (object) {
          Tone.Transport.pause()
          object.material.color.setHex(0xffffff)
        }
      } else {
        document.body.style.cursor = 'default'
        Tone.Transport.start()
        if (this.state.lastHoveredObj) {
          const object = this._scene.getObjectByName(this.state.lastHoveredObj.object.name)
          object.material.color.setHex(0x000000)
        }
      }
    }
  }

  private _render = (): void => {
    this._renderer.render(this._scene, this._camera)
  }

  private init = (): void => {
    this.createScene()
    this.animate()
    this.generateRipples()
    document.addEventListener('mousemove', this.handleMouseMove)
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
