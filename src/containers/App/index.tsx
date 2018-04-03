import * as React from 'react'
import Pond from '../Pond/Pond'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers/index'
import 'three/trackballcontrols'
import { bindActionCreators } from 'redux'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    threeData: state.threeData,
  }
}

export namespace App {
  export interface State {
    prevObject: any,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<any, App.State> {
  // svg setup
  private svgContainer: any

  //three setup
  private _scene: THREE.Scene | any
  private _camera: THREE.PerspectiveCamera | any
  private _renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private _mouse: THREE.Vector2
  private _raycaster: THREE.Raycaster
  private _vector: THREE.Vector3
  private _intersects: any
  private _controls: THREE.TrackballControls
  private _clock: THREE.Clock

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      prevObject: {}, // the last object we hovered over
    }

    /*
     * Basic THREE setup
     * */
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 3000)
    this._camera.position.set(0, 0, 300)
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    this._renderer = new THREE.WebGLRenderer({ antialias: true })
    this._light = new THREE.SpotLight(0xFFFFFF)
    this._mouse = new THREE.Vector2()
    this._controls = new THREE.TrackballControls(this._camera)
    this._scene.updateMatrixWorld()
    this._camera.updateMatrixWorld()
    this._clock = new THREE.Clock()
    this._clock.autoStart = false

    /*
     * Trackball Params
     * */
    this._controls.rotateSpeed = 3.6
    this._controls.zoomSpeed = 0.8
    this._controls.panSpeed = 1

    this._controls.noZoom = false
    this._controls.noPan = false

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

    this._controls.staticMoving = false
    this._controls.dynamicDampingFactor = 0.12
    this._controls.enabled = true
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor(0x000000)
    this.svgContainer.appendChild(this._renderer.domElement)
    this._light.position.set(0, 0, 150)
    this._light.castShadow = true
    this._light.shadow.mapSize.height = 512
    this._light.shadow.mapSize.width = 512
    this._light.shadow.camera.near = 0
    this._light.shadow.camera.far = 250
    this._scene.add(this._light)
  }

  public _render = (): void => {
    this._renderer.render(this._scene, this._camera)
  }

  private handleMouseMove = (event) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._vector = new THREE.Vector3(this._mouse.x, this._mouse.y, 0).unproject(this._camera)
    this._raycaster = new THREE.Raycaster(this._camera.position, this._vector.sub(this._camera.position).normalize())

    /*
    * This gives us an array of objects that intersect with the scene children
    * We can match the object name to trigger events
    * */
    this._intersects = this._raycaster.intersectObjects(this._scene.children, true)

    if (this._intersects.length) {
      if (this._intersects[0].object.name === 'sphere') {
        window.document.body.style.cursor = 'pointer'
      }
    } else {
      window.document.body.style.cursor = 'default'
    }
  }

  private init = (): void => {
    this.createScene()
    this.animate()
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  componentDidMount() {
    this.init()
  }

  public animate = (): any => {
    requestAnimationFrame(this.animate)
    this._render()
    TWEEN.update()
  }

  public render() {
    return (
      <main>

        <div
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            overflow: 'hidden',
          }}
          ref={node => this.svgContainer = node}
        />

        <div id={'pond'}>
          <Pond
            scene={this._scene}
            camera={this._camera}
          />
        </div>

      </main>
    )
  }
}

export default App
