import {
  addToSceneList,
  resetMouseEvent,
  setCurrentScene,
} from '../actions/actions'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

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
import { Event } from './'

// Look how they implement animation:
// https://github.com/zadvorsky/three.bas/blob/master/examples/_js/root.js

export class Root {
  private scene: THREE.Scene | any
  private camera: THREE.PerspectiveCamera | any
  private renderer: THREE.WebGLRenderer
  private mouse: THREE.Vector2 | any
  public intersects: any
  private clock: THREE.Clock
  private toName: string
  private composer: any
  private stats: any

  private isMouseMove: boolean
  private vector: any
  private raycaster: any

  private step: number

  public events: any

  private sceneList: Array<any>

  constructor() {
    /*
     * Basic THREE setup
     * */
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(new THREE.Color('#262c3c'), 400, 700)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000)
    this.camera.position.set(0, 0, 300)
    this.camera.add(this.scene)
    this.renderer = new THREE.WebGLRenderer({
      antialias: (window.devicePixelRatio === 1),
    })
    this.composer = new THREE.EffectComposer(this.renderer)
    this.mouse = new THREE.Vector2()
    this.camera.updateMatrixWorld()
    this.camera.updateProjectionMatrix()
    this.clock = new THREE.Clock()
    this.clock.autoStart = false

    /*
     * Instantiate Stats for Development
     * */
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    const cameraSpeed = 1

    /*
     * Instantiate the Event Class
     */

    this.events = new Event()

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

    document.addEventListener('mousemove', this.handleMouseMove)
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

  private handleMouseMove = (event) => {
    this.isMouseMove = true
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    this.mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6

    // this.RootScene.animateFloor(event)

    this.vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera)
    this.raycaster = new THREE.Raycaster(
      this.camera.position,
      this.vector.sub(this.camera.position).normalize(),
    )
    /*
     * This gives us an array of objects that intersect with the scene children
     * We can match the object name to trigger events
     * */
    // this.intersects = this.raycaster.intersectObjects(this.props.sceneData.currentScene.children, true)
    //
    // if (this.RootScene.intersects.length) {
    //
    //   // TODO: Do we want hover events? YES
    //   this.props.actions.addLastHoveredObject({ object: this.RootScene.intersects[0] })
    //   if (this.RootScene.intersects[0].object.clickable) {
    //     // Simplify for our animate
    //     this.toName = this.props.mouseData.object.object.name
    //     window.document.body.style.cursor = 'pointer'
    //   } else {
    //     this.resetHandleMouseMove()
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
      this.composer.addPass(new THREE.RenderPass(store.getState().sceneData.currentScene, this.camera))
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

  public animate = () => {
    if (store) {
      this.stats.update()
      TWEEN.update()
      this.THREErender()
      this.composer.render(this.clock.getDelta())
    }
    requestAnimationFrame(this.animate)
  }

  private THREErender = () => {
    this.renderer.render(
      store.getState().sceneData.currentScene,
      this.camera
    )

    this.step += 1

    if (this.mouse.mouseX && this.mouse.mouseY) {
      this.camera.position.x += (this.mouse.mouseX - this.camera.position.x) * 0.02
      // this.RootScene.camera.position.y += (-this.RootScene.mouse.mouseY - this.RootScene.camera.position.y) * 0.005
      this.camera.lookAt(store.getState().sceneData.currentScene.position)
    }
    // const eventSyria = this.RootScene.scene.getObjectByName('event:Syria')
    // if (eventSyria) {
    //   this.backgroundParticles.animateParticles()
    //   this.eventParticles.rotateElement()
    //   this.eventParticles.updateCameraPosition(this.RootScene.camera.position)
    // }
  }

  // public postStoreInit = () => {
  //   if (store) {
  //     this.in()
  //   }
  // }

  public addSections = (sections) => {
    sections.forEach(section => {
      this.sceneList.push(section)
      store.dispatch(addToSceneList({ scene: section.el }))
    })
  }

  private getSceneClass = (name?: string): any => {
    let getSceneFromState
    if (!name) {
      getSceneFromState = store.getState().sceneData.currentScene
    } else {
      getSceneFromState = store.getState().sceneData.scenes.filter(scene => scene.el.name === name)
    }
    return this.sceneList.filter(scene => scene.el === getSceneFromState)[0]
  }

  public switchScene = (name): Promise<any> => {
    return new Promise(resolve => {
      resolve(store.dispatch(setCurrentScene({ name })))
      this.switchSceneChangeStart()
    })
  }

  // private switchScene = (name) => {
  //   this.events.on('root:SwitchScene', callback)
  // }

  private switchSceneChangeStart = () => {
    this.getSceneClass().onIn(this.getSceneClass().in())
  }

  private switchSceneChangeStartSuccess = () => {
    this.getSceneClass().onOut(this.getSceneClass().out())
  }
}
