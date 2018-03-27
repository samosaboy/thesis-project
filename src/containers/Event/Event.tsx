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
const TextSprite = require('three.textsprite')
const helveticaRegular = require('./helvetiker_regular.typeface.json')

import 'three/water'
import 'three/sky'
import 'three/canvasRenderer'

// Temporarily
import * as drone from '../../../public/media/drone_01_sound.mp3'
import {colors} from "../../constants";

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  event: any,
}

interface State {
  mouseOver: boolean
  lastHoveredObj: any,
  mounted: boolean,
  isPropogating: boolean,
  toggleText: boolean,
  values: any
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
  private _pointCloud: any
  private _loader: THREE.FontLoader

  private step: number

  // audio
  private _bufferPromise: any
  private _backgroundSound: Tone.Player

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouseOver: false,
      lastHoveredObj: null,
      isPropogating: false,
      mounted: false,
      toggleText: false,
      values: {}
    }

    this.step = 0

    this._rippleArray = []
    this._bubbleArray = []

    // three setup
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 1000)
    this._renderer = new THREE.WebGLRenderer({antialias: true})
    this._light = new THREE.DirectionalLight(0xffffff, 1.0)
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()
    this._loader = new THREE.FontLoader

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
    this.props.event.data.stats.forEach((stat, i) => {
      // ripple setup
      const circle = new THREE.Mesh(
        new THREE.TorusGeometry(stat.id * 5, 0.2, 8, 100),
        new THREE.MeshBasicMaterial({
          color: 0x4C6F97,
          shading: THREE.FlatShading,
        })
        // new THREE.MeshBasicMaterial({color: 0x252A4D})
      )
      circle.name = `circle-${stat.id}`
      this._scene.add(circle)

      // text setup
      const sprite = new TextSprite({
        textSize: 1,
        redrawInterval: 250,
        texture: {
          text: '0 ' + stat.text,
          fontFamily: 'Arial'
        },
        material: {
          color: 0xffffff,
          opacity: 0
        }
      })
      sprite.name = `text-${stat.id}`
      sprite.position.set(0, stat.id * 5, 1)

      this._scene.add(sprite)

      // audio setup
      const audioFile = require(`../../../public/media/${stat.sound}`)
      const waveform = new Tone.Waveform(1024)
      const fft = new Tone.FFT(32)
      const freeverb = new Tone.JCReverb(0.9).toMaster()
      const sound = new Tone.Player({
        url: audioFile,
        volume: stat.volume,
        retrigger: false,
        loop: true,
      }).fan(fft, waveform).connect(freeverb).toMaster().sync()

      /*
      * The interval is based on the number of beats specified in the constructor
      * I should figure out how fast etc I want my audio
      * */
      const now = Tone.now()
      const loop = new Tone.Loop({
        callback: time => {
          // Queues for the next event
          sound.start(now).stop(now + 0.85)
        },
        interval: stat.interval,
        probability: 1
      })

      this._bufferPromise.then(() => {
        Tone.Transport.start('+0.05')
        loop.start('+0.2')
        this._backgroundSound.start()
      })

      this._rippleArray[i] = {
        circle,
        waveform,
        text: stat.text,
        value: 0
      }
    })
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor(0x191D3E)
    this.svgContainer.appendChild(this._renderer.domElement)
    this._light.position.set(0, 0, 2)
    this._scene.add(this._light)

    // this.generatePointCloud()

    this._pointCloud = this.generatePointCloud(new THREE.Color(0x5D6BC1), 100, 100)
    this._pointCloud.rotation.set(Math.PI / 2, 0, 0)
    this._pointCloud.scale.set(85, 85, 85)
    this._pointCloud.position.set(4, 0, 0)
    this._scene.add(this._pointCloud)

    this._camera.position.x = 0
    this._camera.position.y = 0
    // this._camera.position.z = 400
    this._camera.position.z = 100
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  // So you can actually create a texture out of a canvas
  generateSprite = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 40
    canvas.height = 40
    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0, canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    )
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(0,0,255,1)')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }

  generatePointCloud = (color, width, length) => {
    const geometry = new THREE.Geometry()
    const colors = []
    let k = 0
    // this sets the dimensions (n, n square)
    const widthVariation = 5
    const heightVariation = 5
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        const u = i / (width / widthVariation)
        const v = j / (length / heightVariation)
        const x = u - (widthVariation / 2)
        const y = 0
        const z = v - (heightVariation / 2)
        geometry.vertices.push(new THREE.Vector3(x, y, z))
        const intensity = (y + 0.1) * 7
        colors[k] = (color.clone().multiplyScalar(intensity))
        k++
      }
      geometry.colors = colors
    }
    geometry.computeBoundingBox()
    const material = new THREE.PointsMaterial({size: 0.45, vertexColors: THREE.VertexColors})
    return new THREE.Points(geometry, material)
  }

  public animate = (): void => {
    requestAnimationFrame(this.animate)
    this._render()
    this.animateRipple()
    TWEEN.update()
  }

  private animateRipple = (): void => {
    Tone.Transport.schedule(() => {
      this.step += 0.0005
      // There might be a better way than looping through to get q.waveform data
      this._rippleArray.forEach((q, i) => {
        const frequencyData: any = q.waveform.getValue()
        const max: number = Number(d3.max(frequencyData)) * 100
        const object = this._scene.getObjectByName(`circle-${i + 1}`)
        const textObject = this._scene.getObjectByName(`text-${i + 1}`)
        const delta = max > 1 ? max : 1

        if (max > 1) {
          // console.log(max)
          q.value++
          textObject.material.map.text = q.value.toString() + ' ' + q.text
        }

        if (this.state.toggleText) {
          new TWEEN.Tween(textObject.material)
          .to({
            opacity: 1
          }, 1000)
          .easing(TWEEN.Easing.Cubic.Out).start()
        } else {
          new TWEEN.Tween(textObject.material)
          .to({
            opacity: 0
          }, 1000)
          .easing(TWEEN.Easing.Cubic.Out).start()
        }

        new TWEEN.Tween(textObject.position)
        .to({
          y: (i + 1) * 5 * (max > 0 ? max : 1)
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out).start()

        this.setState({isPropogating: max > 1 && true})

        const rippleTween = new TWEEN.Tween(object.scale)
        .to({
          x: delta,
          y: delta,
          // TODO: play with z-position
          z: delta + 1,
        }, 500)
        .easing(TWEEN.Easing.Cubic.Out).start()
      })

      this._pointCloud.geometry.vertices.forEach(v => {
        const delta = (Math.sin((v.x / 2 + this.step) * Math.PI * 2)
          + Math.cos((v.z / 2 + this.step * 2) * Math.PI)
          + Math.sin((v.x + v.y + this.step * 2) / 4 * Math.PI)) / 10
        v.y = delta * 2
      })
      this._pointCloud.geometry.verticesNeedUpdate = true
    })
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
          object.material.color.setHex(0x4C6F97)
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
    setTimeout(() => {
      this.setState({mounted: true})
    }, 0)
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  public render() {
    const _event = this.props.event.data
    return (
      <div style={{
        backgroundColor: _event.backgroundColor,
        borderColor: _event.borderColor,
        ...styles.event
      }}>
        <div style={{
          opacity: this.state.mounted ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
        }}>
          <header style={styles.header}>
            <button
              onMouseDown={() => this.props.history.goBack()}
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
            <div>
              <button
                style={{
                  cursor: this.state.mouseOver ? 'pointer' : 'normal',
                  ...styles.toggleButton
                }}
                onMouseDown={() => this.setState({toggleText: !this.state.toggleText})}
                onMouseOver={() => this.setState({mouseOver: true})}
                onMouseOut={() => this.setState({mouseOver: false})}
              >
                <h2 style={styles.toggleText}>Toggle Information</h2>
              </button>
            </div>
            <div style={{
              opacity: this.state.toggleText ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              marginTop: 10
            }}>
              <h1 style={styles.geoText}>
                {_event.properties.geo.location}, {_event.properties.geo.map}
              </h1>
              <span style={styles.description}>
                {_event.properties.description}
              </span>
            </div>

          </header>

          <div style={{
            opacity: this.state.toggleText ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}>
            More text goes here
          </div>

          <div
            style={styles.svgContainer}
            ref={node => this.svgContainer = node}
          />
        </div>

      </div>
    )
  }
}

export default withRouter(EventContainer)
