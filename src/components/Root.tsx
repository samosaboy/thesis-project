import {
  addLastHoveredObject,
  addMouseEvent,
  addToSceneList,
  resetMouseEvent,
  setCurrentScene,
} from '../actions/actions'
import { store } from '../index'

import { Interaction } from 'three.interaction'

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
import {
  PondScene,
  RootEvent,
  WelcomeScene,
} from '../containers/App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

// Look how they implement animation:
// https://github.com/zadvorsky/three.bas/blob/master/examples/_js/root.js

export class Root {
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

  private sceneList: Array<any>
  private currentScene: any
  private nextScene: any

  constructor() {
    /*
     * Basic THREE setup
     * */
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.set(0, 0, 300)
    this.renderer = new THREE.WebGLRenderer({
      antialias: (window.devicePixelRatio === 1),
    })
    this.composer = new THREE.EffectComposer(this.renderer)
    this.mouse = new THREE.Vector2()
    this.camera.updateMatrixWorld()
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
     * Set scene list
     */
    this.sceneList = []

    /*
     * Instantiate the post-processing
     */
    this.postProcessing()

    /*
     * Custom camera functionality
     * for THREE.Camera prototype
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
  }

  public handleMouseMove = (event) => {
    this.mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    this.mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6
  }

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

  private switchScreenPromise = (name): Promise<any> => {
    this.currentScene = store.getState().sceneData.currentScene
    return new Promise(resolve => {
      store.dispatch(setCurrentScene({ name }))
      resolve()
    })
  }

  public addSections = (sections: Array<any>): void => {
    sections.forEach(section => {
      this.sceneList.push(section)
      store.dispatch(addToSceneList({ scene: section.el }))
    })
  }

  public setDefaultScreen = (name: string): void => {
    this.switchScreenPromise(name)
      .then(() => {
        this.setCurrentSceneFromState()
        this.switchSceneChangeOn(true)
      })
  }

  public switchScreen = (name: string): void => {
    this.nextScene = { name }
    this.switchScreenPromise(name)
      .then(() => {
        this.switchSceneChangeOn()
        this.setCurrentSceneFromState()
      })
  }

  public setCurrentSceneFromState = () => {
    this.currentScene = store.getState().sceneData.currentScene
    this.currentScene.fog = new THREE.Fog(new THREE.Color('#262c3c'), 400, 700)
    const interaction = new Interaction(this.renderer, this.currentScene, this.camera)
  }

  public switchSceneChangeOn = (setDefault = false) => {
    let data
    if (setDefault) {
      data = {
        from: null,
        to: 'welcomeScene',
      }
    } else {
      data = {
        from: this.currentScene.name,
        to: this.nextScene.name,
      }
    }
    RootEvent.eventTrigger('sectionChangeStart', data)
    if (!this.frameId) {
      this.animate()
    }
  }

  public animate = () => {
    if (store) {
      this.stats.update()
      TWEEN.update()
      this.composer.render(this.clock.getDelta())
    }
    this.render()
    this.frameId = requestAnimationFrame(this.animate)
  }

  private render = () => {
    let renderSceneFromState
    switch (this.currentScene.name) {
      case 'welcomeScene':
        renderSceneFromState = WelcomeScene
        break
      case 'pondScene':
        renderSceneFromState = PondScene
        break
      default:
        break
    }

    renderSceneFromState.update()

    this.renderer.render(
      renderSceneFromState.el,
      this.camera,
    )

    if (this.mouse.mouseX && this.mouse.mouseY) {
      this.camera.position.x += (this.mouse.mouseX - this.camera.position.x) * 0.2
      this.camera.position.y += (-this.mouse.mouseY - this.camera.position.y) * 0.005
      this.camera.lookAt(this.currentScene.position)
    }
  }
}
