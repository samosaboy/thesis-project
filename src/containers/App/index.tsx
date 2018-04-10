import * as React from 'react'
import Pond from '../Pond/Pond'
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { RootState } from '../../reducers/index'
import { bindActionCreators } from 'redux'
import {
  BackgroundParticles,
  EventParticles,
  Root,
  TextGeometry,
} from '../../components'

import {
  BloomPass,
  EffectComposer,
  RenderPass,
  SMAAPass,
} from 'postprocessing'

import 'three/copyshader'
import 'three/effectcomposer'
import 'three/shaderpass'
import 'three/renderpass'
import 'three/fxaashader'
import 'three/maskpass'
import 'three/smaashader'
import 'three/smaapass'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

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

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<App.Props, App.State> {
  // svg setup
  private svgContainer: any

  // scene controls
  public toName: string

  // animate array setup
  private animateArray: Array<any>

  // text elements & other elements
  private _text1: any
  private eventParticles: any

  //root
  private RootScene: any


  // postprocessing
  private composer
  private depthMaterial
  private depthRenderTarget

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      prevObject: {}, // the last object we hovered over
    }

    this.RootScene = new Root()
    this.animateArray = []
  }

  public setDefaultScene = (): Promise<any> => {
    return new Promise(resolve => {
      resolve(this.props.actions.addToSceneList({ scene: this.RootScene.scene }) &&
        this.props.actions.setCurrentScene({ name: 'mainScene' }))
    })
  }

  componentDidMount() {
    if (this.svgContainer) {
      this.RootScene.setContainer(this.svgContainer)
      this.RootScene.createScene()
      this.setDefaultScene().then(() => {
        this.postProcessing()
        this.animate()
      })

      // TODO: Move these to own scene
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

      this._text1.in()
      this._text1.setName('to:pondScene')
      this.RootScene.scene.add(this._text1.mesh)

      const particles = new BackgroundParticles({
        count: 1000,
        particleSize: 1.2,
        rangeY: [
          -100,
          100,
        ],
      })
      this.RootScene.scene.add(particles.getElement())

      this.eventParticles = new EventParticles()
      this.RootScene.scene.add(this.eventParticles.getElement())

    }

    /*
     * Mouse events
     * */
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  private resetHandleMouseMove = () => {
    this.toName = ''
    this.props.actions.resetMouseEvent({ object: null })
    window.document.body.style.cursor = 'default'
  }

  private handleMouseMove = (event) => {
    this.RootScene.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.RootScene.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.RootScene.mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    this.RootScene.mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6

    this.RootScene.vector = new THREE.Vector3(this.RootScene.mouse.x, this.RootScene.mouse.y, 0).unproject(this.RootScene.camera)
    this.RootScene.raycaster = new THREE.Raycaster(
      this.RootScene.camera.position,
      this.RootScene.vector.sub(this.RootScene.camera.position).normalize(),
    )
    /*
     * This gives us an array of objects that intersect with the scene children
     * We can match the object name to trigger events
     * */
    this.RootScene.intersects = this.RootScene.raycaster.intersectObjects(this.props.sceneData.currentScene.children)

    if (this.RootScene.intersects.length) {
      this.props.actions.addLastHoveredObject({ object: this.RootScene.intersects[0] })
      if (this.RootScene.intersects[0].object.clickable) {
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
    if (this.RootScene.intersects.length) {
      this.props.actions.addMouseEvent({
        event: 'mousedown',
        object: this.RootScene.intersects[0],
      })
      this.RootScene.clock.start()
    }
  }

  private handleMouseUp = () => {
    this.props.actions.addMouseEvent({
      event: 'mouseout',
    })
    this.RootScene.clock.stop()
  }

  private setScene = name => {
    this.props.actions.setCurrentScene({ name })
    this.RootScene.camera.reset()
  }

  public sceneBus = () => {
    if (!this.props.mouseData.event) {
      return
    }

    if (this.props.mouseData.event === 'mousedown') {
      if (this.props.mouseData.object) {
        // this._clock.getElapsedTime() > 0
        // this.RootScene.camera.zoom(this.props.mouseData.object.object)
        switch (this.toName) {
          case'to:pondScene':
            this._text1.out().then(() => {
              this.setScene('pondScene')
            })
            break
          case 'to:mainScene':
            this.setScene('mainScene')
            this._text1.in()
            break
          default:
            break
        }
      }
    } else {
      // running this messes with the controls...
      // this._camera.reset()
    }
  }

  private postProcessing = () => {
    const res = window.devicePixelRatio
    /*
     * Add Postprocessing Effects
     * */

    this.composer = new THREE.EffectComposer(this.RootScene.renderer)
    this.composer.addPass(new THREE.RenderPass(this.props.sceneData.currentScene, this.RootScene.camera))
    this.composer.setSize(window.innerWidth * res, window.innerHeight * res)

    const bloomPass = new BloomPass(
      {
        resolutionScale: 0.06,
        intensity: 1.2,
        distinction: 1,
      },
    )
    bloomPass.renderToScreen = true
    this.composer.addPass(bloomPass)
  }

  public animate = () => {
    this.RootScene.stats.update()
    TWEEN.update()
    this.THREErender()
    this.sceneBus()
    this.composer.render(this.RootScene.clock.getDelta())
    requestAnimationFrame(this.animate)

    /*
     * Loop through animateArray
     * and call each function
     * */
    this.animateArray.forEach(fn => fn.call())
  }

  private THREErender = () => {
    if (this.RootScene.mouse.mouseX && this.RootScene.mouse.mouseY) {
      this.RootScene.camera.position.x += (this.RootScene.mouse.mouseX - this.RootScene.camera.position.x) * 0.02
      // this.RootScene.camera.position.y += (-this.RootScene.mouse.mouseY - this.RootScene.camera.position.y) * 0.005
      this.RootScene.camera.lookAt(this.props.sceneData.currentScene.position)
    }
    const sphere = this.RootScene.scene.getObjectByName('sphere')
    if (sphere) {
      this.eventParticles.updateCameraPosition(this.RootScene.camera.position)
    }
    this.RootScene.renderer.render(
      this.props.sceneData.currentScene,
      this.RootScene.camera,
    )
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

        <Pond
          camera={this.RootScene.camera}
          clock={this.RootScene.clock}
          animateArray={this.animateArray}
        />

      </main>
    )
  }
}

export default App
