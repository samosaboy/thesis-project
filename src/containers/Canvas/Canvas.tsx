import * as React from 'react'
import * as actions from '../../actions/actions'
import {withRouter} from 'react-router'
import {data} from '../../../public/data.js'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import styles from "../Event/EventStyles";

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const TextSprite = require('three.textsprite')

import 'three/trackballcontrols'

export namespace Canvas {
  export interface Props {
    actions?: typeof actions,
    history?: any,
  }

  export interface State {
    data: any,
    loading: boolean,
    lastHoveredEvent: any
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

@connect(null, mapDispatchToProps)
class Canvas extends React.PureComponent<Canvas.Props, Canvas.State> {
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

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      loading: true,
      lastHoveredEvent: {}
    }

    // three setup
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
    this._camera.position.z = 150
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    this._renderer = new THREE.WebGLRenderer({antialias: true})
    this._light = new THREE.DirectionalLight(0xffffff, 1.0)
    this._light.position.set(0, 0, 150)
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()
    this._controls = new THREE.TrackballControls(this._camera)
    this._scene.updateMatrixWorld()

    // Trackball Controls
    this._controls.rotateSpeed = 3.6
    this._controls.zoomSpeed = 0.8
    this._controls.panSpeed = 1

    this._controls.noZoom = false
    this._controls.noPan = false

    // Camera Controls
    this._camera.reset = () => {
      const speed = 1
      new TWEEN.Tween(this._camera.position)
      .to({
        x: 0,
        y: 0,
        z: 150
      }, speed * 1000)
      .easing(TWEEN.Easing.Cubic.Out).start()
    }

    this._camera.zoom = object => {
      const position = new THREE.Vector3()
      position.setFromMatrixPosition(object.matrixWorld)

      const speed = 1

      if (object instanceof THREE.Mesh) {
        new TWEEN.Tween(this._camera.position)
        .to({
          x: position.x,
          y: position.y,
          z: 50
        }, speed * 1000)
        .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }

    this._controls.staticMoving = false
    this._controls.dynamicDampingFactor = 0.12
    this._controls.enabled = true
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor('#e4e4e4')
    this.svgContainer.appendChild(this._renderer.domElement)
    this._light.position.set(0, 0, 1)
    this._scene.add(this._light)
  }

  componentDidMount() {
    this.init()
    if (!this.state.data.length) {
      this.setState({data: data})
      this.setState({loading: false})
    }
  }

  private init = (): void => {
    this.createScene()
    this.animate()
    this.createEvents()
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  createEvents = () => {
    const group = new THREE.Group()
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      })
    )
    sphere.position.set(0, 0, 0)
    this._scene.add(sphere)

    const sprite = new TextSprite({
      textSize: 5,
      redrawInterval: 250,
      texture: {
        text: 'This is an event',
        fontFamily: 'Lora'
      },
      material: {
        color: 0x000000,
      }
    })
    // sprite.name = `text-${stat.id}`
    sprite.position.set(0, -15, 0)

    group.add(sprite)
    group.add(sphere)
    group.name = 'Event'
    group.position.set(-30, 30, 0)
    this._scene.add(group)
  }

  public animate = (): void => {
    requestAnimationFrame(this.animate)
    this._render()
    TWEEN.update()
  }

  private handleMouseMove = (event) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._raycaster.setFromCamera(this._mouse, this._camera)

    if (this.state.data.length) {
      let intersects = []
      const group = this._scene.getObjectByName('Event')
      const raycaster = this._raycaster.intersectObject(group, true)
      if (raycaster.length) {
        intersects = raycaster
      }

      if (intersects.length) {
        document.body.style.cursor = 'pointer'
        this.setState({lastHoveredEvent: intersects[0]})
        group.traverse(child => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
            child.material.color = new THREE.Color('#767676')
            this._camera.zoom(intersects[0].object)
          }
        })
      } else {
        document.body.style.cursor = 'default'
        if (this.state.lastHoveredEvent) {
          group.traverse(child => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
              this._camera.reset()
              child.material.color = new THREE.Color('#000000')
            }
          })
        }
      }
    }
  }

  private showEventInfo = (item: any): any => {
    this.props.actions.eventActive({data: item})
    this.props.history.push({
      pathname: `/${item.id}`,
    })
  }

  private _render = (): void => {
    this._renderer.render(this._scene, this._camera)
  }

  public render() {
    // return this.state.data.map(item => (
    //   <div key={item.id}>
    //     {item.importance}
    //   </div>
    // ))
    return (
      <div
        style={styles.svgContainer}
        ref={node => this.svgContainer = node}
      />
    )
  }
}

export default withRouter(Canvas)
