import {
  addLastHoveredObject,
  addToSceneList,
  resetMouseEvent,
  setCurrentScene,
} from '../actions/actions'
import { store } from '../index'

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
import { RootEvent } from '../containers/App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

// Look how they implement animation:
// https://github.com/zadvorsky/three.bas/blob/master/examples/_js/root.js

export class Root {
  private scene: THREE.Scene | any
  private camera: THREE.PerspectiveCamera | any
  private renderer: THREE.WebGLRenderer
  private frameId: any
  private mouse: THREE.Vector2 | any
  public intersects: any
  private clock: THREE.Clock
  private toName: string
  private composer: any
  private stats: any

  private vector: any
  private raycaster: any

  private step: number

  private sphere: any

  private sceneList: Array<any>
  private currentScene: any
  private nextScene: any

  constructor() {
    /*
     * Basic THREE setup
     * */
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(new THREE.Color('#262c3c'), 400, 700)
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.set(0, 0, 300)
    this.renderer = new THREE.WebGLRenderer({
      antialias: (window.devicePixelRatio === 1),
    })
    this.composer = new THREE.EffectComposer(this.renderer)
    this.mouse = new THREE.Vector2()
    // this.scene.updateMatrixWorld()
    // this.camera.updateMatrixWorld()
    this.clock = new THREE.Clock()
    this.clock.autoStart = false

    this.sphere = new THREE.Mesh(
      new THREE.CubeGeometry(20, 20, 20),
      new THREE.MeshNormalMaterial()
    )
    this.sphere.position.x = 100

    // this.scene.add(this.camera)

    /*
     * Instantiate Stats for Development
     * */
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    const cameraSpeed = 1

    /*
     * Set scene list
     */

    this.sceneList = []

    /*
     * Instantiate the post-processing
     */

    this.postProcessing()

    /*
     * Additional camera functionality
     * */
    this.camera.reset = () => {
      new TWEEN.Tween(this.camera.position)
        .to({
          x: 0,
          y: 0,
          z: 300,
        }, cameraSpeed * 1000)
        .easing(TWEEN.Easing.Cubic.Out).start()
    }

    this.camera.zoom = object => {
      if (object instanceof THREE.Mesh) {
        const position = new THREE.Vector3()
        position.setFromMatrixPosition(object.matrixWorld)

        new TWEEN.Tween(this.camera.position)
          .to({
            x: position.x,
            y: position.y,
            z: 30,
          }, cameraSpeed * 1000)
          .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }

    this.camera.fullZoom = object => {
      if (object instanceof THREE.Mesh) {
        const position = new THREE.Vector3()
        position.setFromMatrixPosition(object.matrixWorld)

        new TWEEN.Tween(this.camera.position)
          .to({
            x: position.x,
            y: position.y,
            z: 10,
          }, cameraSpeed * 3000)
          .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }
  }

  public setContainer = (container) => {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    this.renderer.shadowMap.enabled = true
    container.appendChild(this.renderer.domElement)

  }

  // public createScene = (scene) => {
  //   /*
  //    * Surface Plane
  //    * */
  //   const planeGeometry = new THREE.BoxBufferGeometry(1000, 1, 1000)
  //   const planeMaterial = new THREE.MeshPhongMaterial({
  //     color: '#060615',
  //   })
  //
  //   const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  //   planeMesh.position.set(0, -75, 0)
  //   planeMesh.receiveShadow = true
  //   scene.add(planeMesh)
  //
  //   /*
  //    * Light Params
  //    * */
  //   const spotLight = new THREE.SpotLight(0xFFFFFF)
  //   spotLight.penumbra = 1 // how soft the spotlight looks
  //   spotLight.position.set(0, 200, 0)
  //   scene.add(spotLight)
  //
  //   const shadowLight = new THREE.SpotLight(0xFFFFFF)
  //   shadowLight.penumbra = 1 // how soft the shadowLight looks
  //   shadowLight.position.set(0, 200, 100)
  //   shadowLight.castShadow = true
  //   shadowLight.shadow.mapSize.width = 100
  //   shadowLight.shadow.mapSize.height = 100
  //   scene.add(shadowLight)
  //
  //   const skyBox = new THREE.HemisphereLight('#373f52', '#0e0e1d')
  //   skyBox.position.set(0, 0, 0)
  //   scene.add(skyBox)
  //
  //   const skyGeometry = new THREE.SphereBufferGeometry(1000, 1, 1)
  //   const skyMaterial = new THREE.ShaderMaterial({
  //     vertexShader: `varying vec3 vWorldPosition;
  // 	void main() {
  // 		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  // 		vWorldPosition = worldPosition.xyz;
  // 		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  // 	}`,
  //     fragmentShader: `uniform vec3 topColor;
  // 	uniform vec3 bottomColor;
  // 	uniform float offset;
  // 	uniform float exponent;
  // 	varying vec3 vWorldPosition;
  // 	void main() {
  // 		float h = normalize( vWorldPosition + offset ).y;
  // 		gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
  // 	}`,
  //     uniforms: {
  //       topColor: { value: new THREE.Color('#0a0a0c') },
  //       bottomColor: { value: new THREE.Color('#262c3c') },
  //       offset: { value: 100 },
  //       exponent: { value: 1.1 },
  //     },
  //     side: THREE.BackSide,
  //   })
  //   const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  //   scene.add(sky)
  // }

  // moveFloorIn = () => {
  //   const prev = this.animatedFloor.material.uniforms['uD'].value
  //   return new TWEEN.Tween(this.animatedFloor.material.uniforms['uD'])
  //     .to({
  //       value: 100,
  //     }, 3000)
  //     .easing(TWEEN.Easing.Cubic.InOut)
  //     .start()
  // }
  //
  // moveFloorOut = () => {
  //   const prev = this.animatedFloor.material.uniforms['uD'].value
  //   return new TWEEN.Tween(this.animatedFloor.material.uniforms['uD'])
  //     .to({
  //       value: 4.4,
  //     }, 3000)
  //     .easing(TWEEN.Easing.Cubic.InOut).start()
  // }

  private resetHandleMouseMove = () => {
    this.toName = ''
    store.dispatch(resetMouseEvent({ object: null }))
    window.document.body.style.cursor = 'default'
  }

  public handleMouseMove = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    this.mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6

    this.vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera)
    this.raycaster = new THREE.Raycaster(
      this.camera.position,
      this.vector.sub(this.camera.position).normalize(),
    )
    /*
     * This gives us an array of objects that intersect with the scene children
     * We can match the object name to trigger events
     * */
    // this.intersects = this.raycaster.intersectObjects(this.currentScene.children, true)
    // if (this.intersects.length) {
    //   if (this.intersects[0].object.clickable) {
    //     window.document.body.style.cursor = 'pointer'
    //     store.dispatch(addLastHoveredObject({ object: this.intersects[0] }))
    //     this.toName = store.getState().mouseData.object.object.name
    //   } else {
    //     // this.resetHandleMouseMove()
    //   }
    // } else {
    //   this.resetHandleMouseMove()
    // }
  }

  // private handleMouseDown = () => {
  //   // We also need a way to track if you are holding and which event type you are holding for
  //   if (this.intersects.length) {
  //     this.props.actions.addMouseEvent({
  //       event: 'mousedown',
  //       object: this.RootScene.intersects[0],
  //     })
  //     this.clock.start()
  //   }
  // }
  //
  // private handleMouseUp = () => {
  //   this.props.actions.addMouseEvent({
  //     event: 'mouseout',
  //   })
  //   this.clock.stop()
  // }
  //
  // private setScene = name => {
  //   this.props.actions.setCurrentScene({ name })
  //   this.camera.reset()
  // }
  //
  // public sceneBus = () => {
  //   if (this.props.mouseData.event !== 'mousedown') {
  //     return
  //   } else {
  //     if (this.props.mouseData.object) {
  //       // this._clock.getElapsedTime() > 0
  //       // this.RootScene.camera.zoom(this.props.mouseData.object.object)
  //       // switch (this.toName) {
  //       //   case'to:pondScene':
  //       //     this.titleText.out().then(() => {
  //       //       this.setScene('pondScene')
  //       //     })
  //       //     break
  //       //   case 'to:mainScene':
  //       //     this.setScene('mainScene')
  //       //     this.titleText.in()
  //       //     break
  //       //   case 'event:Syria':
  //       //     this.titleText.out('fast').then(() => {
  //       //       this.syriaText.in('fast')
  //       //     })
  //       //   default:
  //       //     break
  //       // }
  //     }
  //   }
  // }

  private postProcessing = () => {
    if (store) {
      const res = window.devicePixelRatio
      this.composer.addPass(new THREE.RenderPass(this.currentScene, this.camera))
      this.composer.setSize(window.innerWidth * res, window.innerHeight * res)

      const bloomPass = new BloomPass(
        {
          resolutionScale: 0.06,
          intensity: 1.2,
          distinction: 1,
        },
      )
      bloomPass.renderToScreen = true

      const copyPass = new THREE.ShaderPass(THREE.CopyShader)
      copyPass.renderToScreen = true

      this.composer.addPass(copyPass)
      this.composer.addPass(bloomPass)
    }
  }

  private getCurrentSceneClass = () => {
    return this.sceneList.filter(scene => this.currentScene.name === scene.el.name)[0]
  }

  public addSections = (sections: Array<any>): void => {
    sections.forEach(section => {
      this.sceneList.push(section.call(this))
      store.dispatch(addToSceneList({ scene: section.call(this).el }))
    })
  }

  public switchScene = (name): Promise<any> => {
    return new Promise(resolve => {
      store.dispatch(setCurrentScene({ name }))
      this.nextScene = { name }
      this.setCurrentSceneFromState()
      resolve()
    })
  }

  public setCurrentSceneFromState = () => {
    this.currentScene = store.getState().sceneData.currentScene
    this.currentScene.add(this.sphere)
  }

  public switchSceneChangeOn = () => {
    const data = {
      from: this.nextScene.name === this.currentScene.name ? null : this.currentScene.name,
      to: this.nextScene.name,
    }
    RootEvent.eventTrigger('sectionChangeStart', data)
    if (!this.frameId) {
      this.animate()
    }
  }

  public animate = () => {
    if (store) {
      // this.getCurrentSceneClass().onIn(this.getCurrentSceneClass().in())
      this.stats.update()
      TWEEN.update()
      this.composer.render(this.clock.getDelta())
      this.sphere.rotation.x += 0.01
    }
    this.render()
    this.frameId = requestAnimationFrame(this.animate)
  }

  private render = () => {
    this.renderer.render(
      this.currentScene,
      this.camera
    )

    this.step += 1

    if (this.mouse.mouseX && this.mouse.mouseY) {
      this.camera.position.x += (this.mouse.mouseX - this.camera.position.x) * 0.2
      this.camera.position.y += (-this.mouse.mouseY - this.camera.position.y) * 0.005
      this.camera.lookAt(this.currentScene.position)
    }
    // const eventSyria = this.RootScene.scene.getObjectByName('event:Syria')
    // if (eventSyria) {
    //   this.backgroundParticles.animateParticles()
    //   this.eventParticles.rotateElement()
    //   this.eventParticles.updateCameraPosition(this.RootScene.camera.position)
    // }
  }
}
