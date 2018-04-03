import * as React from 'react'
// import {
//   Route,
//   Switch,
// } from 'react-router'
// import EventContainer from '../Event/Event'
import Pond from '../Pond/Pond'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
// import { history } from '../../index'
import { RootState } from '../../reducers/index'
import 'three/trackballcontrols'
import { bindActionCreators } from 'redux'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const TextSprite = require('three.textsprite')

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

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<any, any> {
  // svg setup
  private svgContainer: any

  //three setup
  private _scene: THREE.Scene | any
  private _camera: THREE.PerspectiveCamera | any
  private _renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private _mouse: THREE.Vector2
  private _raycaster: THREE.Raycaster
  private _controls: THREE.TrackballControls
  private _clock: THREE.Clock
  private _animate: any

  constructor(props?: any, context?: any) {
    super(props, context)

    // three setup
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 3000)
    this._camera.position.z = 300
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    this._renderer = new THREE.WebGLRenderer({ antialias: false })
    this._light = new THREE.SpotLight(0xffffff)
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()
    this._controls = new THREE.TrackballControls(this._camera)
    this._scene.updateMatrixWorld()
    this._clock = new THREE.Clock()
    this._clock.autoStart = false

    // Props stuff
    this._animate = []

    // Trackball Controls
    this._controls.rotateSpeed = 3.6
    this._controls.zoomSpeed = 0.8
    this._controls.panSpeed = 1

    this._controls.noZoom = false
    this._controls.noPan = false

    const cameraSpeed = 1

    // Camera Controls
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
    this._renderer.setClearColor('#FFF')

    // this._renderer.enableScissorTest(true)

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

    this._raycaster.setFromCamera(this._mouse, this._camera)
  }

  private init = (): void => {
    this.createScene()
    this.animate()
    // document.addEventListener('mousemove', this.handleMouseMove)
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
          }}
          ref={node => this.svgContainer = node}
        />

        <Pond
          scene={this._scene}
        />

        {/*<Switch>*/}
          {/*<Route*/}
            {/*key={'mainStage'}*/}
            {/*path={'/pond'}*/}
            {/*render={() => <MainStage*/}
              {/*scene={this._scene}*/}
            {/*/>}*/}
          {/*/>*/}
          {/*<Route*/}
            {/*key={'eventId'}*/}
            {/*path={'/event/:eventId'}*/}
            {/*component={EventContainer}*/}
          {/*/>*/}
          {/*<Route*/}
            {/*exact*/}
            {/*path={'/'}*/}
            {/*render={() => <button onClick={() => history.push('/pond')}>*/}
              {/*Go!*/}
            {/*</button>}*/}
          {/*/>*/}
        {/*</Switch>*/}

      </main>
    )
  }
}

export default App
