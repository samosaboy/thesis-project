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

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      prevObject: {}, // the last object we hovered over
    }

    this.RootScene = new Root()

    /*
     * Animate Array
     * */
    this.animateArray = []

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
      this.setDefaultScene().then(() => this.animate())

      this._text1.in()
      this._text1.setName('to:pondScene')
      this.RootScene.scene.add(this._text1.mesh)

      // TODO: Move these to own scene
      const particles = new BackgroundParticles({
        count: 1000,
        particleSize: 0.1,
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
        if (this.toName === 'to:pondScene') {
          //this._clock.getElapsedTime() > 0
          // Here we should be using stuff like scene.in() and have visible; false, opacity: 1 etc for fade transitions
          // this._camera.zoom(this.props.mouseData.object.object)
          this._text1.out().then(() => {
            this.setScene('pondScene')
          })
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

  public animate = () => {
    this.RootScene.stats.update()
    TWEEN.update()
    this.THREErender()
    this.sceneBus()
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
      this.RootScene.camera.position.y += (-this.RootScene.mouse.mouseY - this.RootScene.camera.position.y) * 0.005
      this.RootScene.camera.lookAt(this.props.sceneData.currentScene.position)
    }
    this.RootScene.renderer.render(this.props.sceneData.currentScene, this.RootScene.camera)
  }

  // public _render = (): void => {
  //   const marbles = this.RootScene.scene.getObjectByName('sphere')
  //   if (this.RootScene.camera.position && marbles) {
  //     this.eventParticles.updateCameraPosition(this.RootScene.camera.position)
  //   }
  //   this.RootScene.renderer.render(this.props.sceneData.currentScene, this.RootScene.camera)
  //   console.log(this.RootScene.renderer)
  // }

  public render() {
    return (
      <main>

        {/*<div*/}
        {/*onMouseDown={this.handleMouseDown}*/}
        {/*onMouseUp={this.handleMouseUp}*/}
        {/*style={{*/}
        {/*position: 'absolute' as 'absolute',*/}
        {/*width: window.innerWidth,*/}
        {/*height: window.innerHeight,*/}
        {/*zIndex: 999,*/}
        {/*top: 0,*/}
        {/*left: 0,*/}
        {/*}}*/}
        {/*/>*/}

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
