import * as React from 'react'
import Pond from '../Pond/Pond'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers/index'
import { bindActionCreators } from 'redux'
import {
  BackgroundParticles,
  EventParticles,
  TextGeometry,
} from '../../components'

// import 'three/trackballcontrols'
// import 'three/flycontrols'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

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
  }
}

// TODO: Check if @connect rerenders this entire component on every redux change
@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  // svg setup
  private svgContainer: any

  // three setup
  private _scene: THREE.Scene | any
  private _camera: THREE.PerspectiveCamera | any
  private _renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private _mouse: THREE.Vector2 | any
  private _raycaster: THREE.Raycaster
  private _vector: THREE.Vector3
  private _intersects: any
  private _clock: THREE.Clock

  // stats
  private stats: any

  // scene controls
  public toName: string

  // animate array setup
  private animateArray: Array<any>

  // text elements
  private _text1: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      prevObject: {}, // the last object we hovered over
    }

    /*
     * Animate Array
     * */
    this.animateArray = []

    /*
     * Basic THREE setup
     * */
    this._scene = new THREE.Scene()
    this._scene.name = 'mainScene'
    this._scene.fog = new THREE.Fog(new THREE.Color('#e0e0e0'), 1, 5000)
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    this._camera.position.set(0, 0, 300)
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    this._renderer = new THREE.WebGLRenderer({ antialias: true })
    this._renderer.shadowMap.enabled = true
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this._mouse = new THREE.Vector2()
    this._scene.updateMatrixWorld()
    this._camera.updateMatrixWorld()
    this._camera.updateProjectionMatrix()
    this._clock = new THREE.Clock()
    this._clock.autoStart = false

    // this._controls = new THREE.FlyControls(this._camera)
    // this._controls.movementSpeed = 25
    // this._controls.domElement = this._renderer.domElement
    // this._controls.rollSpeed = Math.PI / 24
    // this._controls.autoForward = false
    // this._controls.dragToLook = false

    const cameraSpeed = 1

    /*
     * Additional camera functionality
     * */
    this._camera.reset = () => {
      new TWEEN.Tween(this._camera.position)
        .to({
          x: 0,
          y: 0,
          z: 300,
        }, cameraSpeed * 1000)
        .easing(TWEEN.Easing.Cubic.Out).start()
    }

    this._camera.zoom = object => {
      if (object instanceof THREE.Mesh) {
        const position = new THREE.Vector3()
        position.setFromMatrixPosition(object.matrixWorld)

        new TWEEN.Tween(this._camera.position)
          .to({
            x: position.x,
            y: position.y,
            z: 30,
          }, cameraSpeed * 1000)
          .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }

    this._camera.fullZoom = object => {
      if (object instanceof THREE.Mesh) {
        const position = new THREE.Vector3()
        position.setFromMatrixPosition(object.matrixWorld)

        new TWEEN.Tween(this._camera.position)
          .to({
            x: position.x,
            y: position.y,
            z: 10,
          }, cameraSpeed * 3000)
          .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }

    /* Text Elements */
    this._text1 = new TextGeometry({
      text: 'T H E \n R I P P L E \n E F F E C T',
      options: {
        align: 'left',
        size: 500,
        lineSpacing: 20,
        font: 'Lato',
        style: 'Bold',
        color: '#FFFFFF',
      },
    })
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    // this._renderer.setClearColor(0x000000)
    this._renderer.gammaInput = true
    this._renderer.gammaOutput = true
    this._renderer.shadowMap.enabled = true
    this.svgContainer.appendChild(this._renderer.domElement)

    /*
     * Instantiate Stats for Development
     * */
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    // Plane
    const planeGeometry = new THREE.BoxBufferGeometry(6000, 10, 10000)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: '#060615',
      dithering: true,
    })
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    planeMesh.position.set(0, -50, 0)
    planeMesh.receiveShadow = true

    this._scene.add(planeMesh)

    /*
     * Light Params
     * */
    const spotLight = new THREE.SpotLight(0xFFFFFF)
    spotLight.penumbra = 1 // how soft the spotlight looks
    spotLight.position.set(0, 200, 0)
    this._scene.add(spotLight)

    const shadowLight = new THREE.SpotLight(0xFFFFFF)
    shadowLight.penumbra = 1 // how soft the shadowLight looks
    shadowLight.position.set(0, 200, 100)
    shadowLight.castShadow = true
    shadowLight.shadow.mapSize.width = 100
    shadowLight.shadow.mapSize.height = 100
    this._scene.add(shadowLight)

    const skyBox = new THREE.HemisphereLight('#373f52', '#0e0e1d')
    skyBox.position.set(0, 50, 0)
    this._scene.add(skyBox)

    const skyGeometry = new THREE.SphereGeometry(600, 32, 15)
    const skyMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
      fragmentShader: `uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
			varying vec3 vWorldPosition;
			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
			}`,
      uniforms: {
        topColor: { value: new THREE.Color('#141418') },
        bottomColor: { value: new THREE.Color('#262c3c') },
        offset: { value: 100 },
        exponent: { value: 1.1 },
      },
      side: THREE.BackSide,
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    sky.clickable = false
    this._scene.add(sky)

    this.props.actions.addToSceneList({ scene: this._scene })
    this.props.actions.setCurrentScene({ name: 'mainScene' })
  }


  private init = (): void => {
    this.createScene()
    this.animate()
    this.animateArray.push(this._render)

    /*
     * Mouse events
     * */
    document.addEventListener('mousemove', this.handleMouseMove)
    // document.addEventListener('mousedown', this.handleMouseDown)
    // document.addEventListener('mouseup', this.handleMouseUp)
  }

  componentDidMount() {
    this.init()
    this._text1.in()
    this._text1.setName('to:pondScene')
    this._scene.add(this._text1.getElement())

    // TODO: Move these to own scene
    const particles = new BackgroundParticles({
      count: 1000,
      particleSize: 0.1,
      rangeY: [
        -100,
        100,
      ],
    })
    this._scene.add(particles.getElement())

    const eventParticles = new EventParticles()
    this._scene.add(eventParticles.getElement())
  }

  private resetHandleMouseMove = () => {
    this.toName = ''
    this.props.actions.resetMouseEvent({ object: null })
    window.document.body.style.cursor = 'default'
  }

  private handleMouseMove = (event) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    this._mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6

    this._vector = new THREE.Vector3(this._mouse.x, this._mouse.y, 0).unproject(this._camera)
    this._raycaster = new THREE.Raycaster(this._camera.position, this._vector.sub(this._camera.position).normalize())

    /*
     * This gives us an array of objects that intersect with the scene children
     * We can match the object name to trigger events
     * */
    this._intersects = this._raycaster.intersectObjects(this.props.sceneData.currentScene.children, true)

    if (this._intersects.length) {
      this.props.actions.addLastHoveredObject({ object: this._intersects[0] })
      if (this._intersects[0].object.clickable) {
        // Simplify for our animate
        this.toName = this.props.mouseData.object.object.name
        window.document.body.style.cursor = 'pointer'
      } else {
        this.resetHandleMouseMove()
      }
    } else {
      this.resetHandleMouseMove()
    }
  }

  private handleMouseDown = () => {
    // We also need a way to track if you are holding and which event type you are holding for
    if (this._intersects.length) {
      this.props.actions.addMouseEvent({
        event: 'mousedown',
        object: this._intersects[0],
      })
      this._clock.start()
    }
  }

  private handleMouseUp = () => {
    this.props.actions.addMouseEvent({
      event: 'mouseout',
    })
    this._clock.stop()
  }

  private setScene = name => {
    this.props.actions.setCurrentScene({ name })
    this._camera.reset()
  }

  private animate = (): any => {
    // https://stackoverflow.com/questions/31282318/is-there-a-way-to-cancel-requestanimationframe-without-a-global-variable
    this.stats.update()
    TWEEN.update()
    this.sceneBus()
    requestAnimationFrame(this.animate)
    /*
     * Loop through animateArray
     * and call each function
     * */
    this.animateArray.forEach(fn => fn.call())
  }

  public sceneBus = () => {
    if (!this.props.mouseData.event) {
      return
    }

    if (this.props.mouseData.event === 'mousedown') {
      if (this.props.mouseData.object) {
        if (this.toName === 'to:pondScene') {
          //this._clock.getElapsedTime() > 0
          // Here we should be using stuff like scene.in() and have visible; false, opacity: 1 etc for fade transitions
          // this._camera.zoom(this.props.mouseData.object.object)
          this._text1.out().then(() => this.setScene('pondScene'))
        } else if (this.toName === 'to:mainScene') {
          this.setScene('mainScene')
          this._text1.in()
        }
      }
    } else {
      // running this messes with the controls...
      // this._camera.reset()
    }
  }

  public _render = (): void => {
    if (this._mouse.mouseX && this._mouse.mouseY) {
      this._camera.position.x += (this._mouse.mouseX - this._camera.position.x) * 0.01
      this._camera.position.y += (-this._mouse.mouseY - this._camera.position.y) * 0.01
      this._camera.lookAt(new THREE.Vector3(0, 0, 0))
      // this._camera.lookAt(this.props.sceneData.currentScene.position)
    }
    this._renderer.render(this.props.sceneData.currentScene, this._camera)
  }


  public render() {
    return (
      <main>

        <div
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          style={{
            position: 'absolute' as 'absolute',
            width: window.innerWidth,
            height: window.innerHeight,
            zIndex: 999,
            top: 0,
            left: 0,
          }}
        />

        <div
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            overflow: 'hidden',
          }}
          ref={node => this.svgContainer = node}
        />

        <Pond
          camera={this._camera}
          clock={this._clock}
          animateArray={this.animateArray}
        />

      </main>
    )
  }
}

export default App
