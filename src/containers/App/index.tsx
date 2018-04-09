import * as React from 'react'
import Pond from '../Pond/Pond'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers/index'
import 'three/trackballcontrols'
import { bindActionCreators } from 'redux'
import { TextGeometry, BackgroundParticles } from '../../components'

import 'three/flycontrols'

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
  // private _controls: any

  // stats
  private stats: any

  // scene controls
  public toName: string

  // animate array setup
  private animateArray: Array<any>

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
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    this._camera.position.set(0, 0, 300)
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    this._renderer = new THREE.WebGLRenderer({ antialias: true })
    this._light = new THREE.SpotLight(0xFFFFFF)
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
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor(0x000000)
    this.svgContainer.appendChild(this._renderer.domElement)

    /*
     * Instantiate Stats for Development
     * */
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    /*
     * Light Params
     * */
    this._light.position.set(0, 0, 300)
    this._light.castShadow = true
    this._light.shadow.mapSize.height = 512
    this._light.shadow.mapSize.width = 512
    this._light.shadow.camera.near = 0
    this._light.shadow.camera.far = 250
    this._scene.add(this._light)

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
    const text = new TextGeometry({
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
    text.in()
    text.setName('to:pondScene')
    this._scene.add(text.getElement())

    const particles = new BackgroundParticles({
      count: 1000,
      particleSize: 0.1,
      rangeY: [
        -100,
        100,
      ],
    })

    this._scene.add(particles.getElement())
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
      }
    } else {
      this.props.actions.resetMouseEvent({ object: null })
      window.document.body.style.cursor = 'default'
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

  private animate = (): any => {
    // https://stackoverflow.com/questions/31282318/is-there-a-way-to-cancel-requestanimationframe-without-a-global-variable
    this.stats.update()
    TWEEN.update()
    requestAnimationFrame(this.animate)

    /*
     * Loop through animateArray
     * and call each function
     * */
    this.animateArray.forEach(fn => fn.call())

    if (this.props.mouseData.event === 'mousedown') {
      if (this.props.mouseData.object) {
        if (this.toName === 'to:pondScene') {
          //this._clock.getElapsedTime() > 0
          // Here we should be using stuff like scene.in() and have visible; false, opacity: 1 etc for fade transitions
          this._camera.zoom(this.props.mouseData.object.object)
          this.props.actions.setCurrentScene({ name: 'pondScene' })
          this._camera.reset()
        } else if (this.toName === 'to:mainScene') {
          this.props.actions.setCurrentScene({ name: 'mainScene' })
          this._camera.zoom(this.props.mouseData.object.object)
          this._camera.reset()
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
