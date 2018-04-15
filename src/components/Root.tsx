import {
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
  private clock: THREE.Clock
  private toName: string
  private composer: any
  private stats: any
  private sceneList: Array<any>
  private currentScene: any
  private nextScene: any

  private cameraSpeed: number
  private cameraShake: number

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

    this.cameraSpeed = 1
    this.cameraShake = 0

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
        }, this.cameraSpeed * 1000)
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
          }, this.cameraSpeed * 1000)
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
          }, this.cameraSpeed * 3000)
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

  private resetHandleMouseMove = () => {
    this.toName = ''
    store.dispatch(resetMouseEvent({ object: null }))
  }

  public handleMouseMove = (event) => {
    this.mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    // this.mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6
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
    // TODO: Figure out how to trigger out() animations (setTimeout is not a good solution)
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

    if (this.mouse.mouseX) {
      this.camera.position.x += (this.mouse.mouseX - this.camera.position.x) * 0.2
      // this.camera.position.y += (-this.mouse.mouseY - this.camera.position.y) * 0.005
      this.camera.lookAt(new THREE.Vector3(0, this.camera.position.y, 0))
    }
    this.camera.position.y += Math.cos(this.cameraShake) / 20
    this.cameraShake += 0.02

    this.renderer.render(renderSceneFromState.el, this.camera)
  }

  public getCamera = () => this.camera
}
