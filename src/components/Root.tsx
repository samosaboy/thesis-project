import {
  addToSceneList,
  resetMouseEvent,
  sceneSetComplete,
  setCurrentScene,
} from '../actions/actions'
import { store } from '../index'

import { Interaction } from 'three.interaction'

import {
  BloomPass,
  EffectComposer,
  RenderPass,
  SMAAPass,
  ShockWavePass
} from 'postprocessing'

import 'three/copyshader'
import 'three/effectcomposer'
import 'three/shaderpass'
import 'three/renderpass'
import 'three/fxaashader'
import 'three/maskpass'
import 'three/smaashader'
import 'three/smaapass'
import 'three/crossfadeScene'
import {
  PondScene,
  RootEvent,
  SyriaEventScene,
  WelcomeScene,
} from '../containers/App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

// Look how they implement animation:
// https://github.com/zadvorsky/three.bas/blob/master/examples/_js/root.js

export class Root {
  private devicePixelRatio: number
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

  public step: number
  public delta: number

  private cameraSpeed: number
  private cameraShake: number

  private defaultScene: string

  public scene: THREE.Scene
  public backToEvent: boolean

  /* Audio */
  public listener: THREE.AudioListener

  constructor() {
    /*
     * Basic THREE setup
     * */

    this.backToEvent = false
    this.scene = new THREE.Scene()
    this.scene.matrixAutoUpdate = false
    this.devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10000)
    this.camera.position.set(0, 0, 300)
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
    })
    this.composer = new THREE.EffectComposer(this.renderer)
    this.mouse = new THREE.Vector2()
    this.camera.updateMatrixWorld()
    this.clock = new THREE.Clock()
    this.scene.add(this.camera)

    /*
     * Instantiate Stats for Development
     * */
    this.stats = new Stats()
    this.stats.showPanel(0)
    this.stats.dom.style.right = 0
    this.stats.dom.style.left = 'auto'
    document.body.appendChild(this.stats.dom)

    this.step = 0
    this.cameraSpeed = 1
    this.cameraShake = 0

    /*
     * Setup audio Listener
     * */

    this.listener = new THREE.AudioListener()
    this.camera.add(this.listener)

    /*
     * Set scene list
     */
    this.sceneList = []


    /*
     * Custom camera functionality
     * for THREE.Camera prototype
     * */
    this.camera.resetPosition = () => {
      new TWEEN.Tween(this.camera.position)
        .to({
          x: 0,
          y: 0,
          z: 300,
        }, this.cameraSpeed * 2000)
        .easing(TWEEN.Easing.Cubic.InOut).start()
    }

    this.camera.resetZoom = () => {
      new TWEEN.Tween(this.camera.rotation)
        .to({
          x: 0,
          y: 0,
          z: 0,
        }, this.cameraSpeed * 2000)
        .easing(TWEEN.Easing.Cubic.InOut).start()
    }

    this.camera.zoom = object => {
      if (object instanceof THREE.Group) {
        return new Promise(resolve => {
          const position = new THREE.Vector3()
          position.setFromMatrixPosition(object.matrixWorld)

          new TWEEN.Tween(this.camera.position)
            .to({
              x: position.x,
              y: position.y,
              z: position.z - 35,
            }, this.cameraSpeed * 2000)
            .easing(TWEEN.Easing.Cubic.InOut).start()
            .onComplete(() => resolve())
        })
      }
    }
  }

  public setContainer = (container) => {
    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight,
    )
    this.renderer.setPixelRatio(this.devicePixelRatio)
    container.appendChild(this.renderer.domElement)
  }

  public clearContext = () => {
    return new Promise(resolve => {
      this.renderer.forceContextLoss()
      this.renderer.context = null
      this.renderer.domElement = null
      this.renderer = null
      resolve()
    })

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
    const res = window.devicePixelRatio
    this.composer.addPass(new THREE.RenderPass(this.currentScene, this.camera))
    this.composer.setSize(window.innerWidth * res, window.innerHeight * res)

    const bloomPass = new BloomPass(
      {
        resolutionScale: 0.04,
        intensity: 2,
        distinction: 0.5,
      },
    )

    bloomPass.renderToScreen = true
    const copyPass = new THREE.ShaderPass(THREE.CopyShader)
    copyPass.renderToScreen = true

    this.composer.addPass(copyPass)
    this.composer.addPass(bloomPass)
  }

  private switchScreenPromise = (name): Promise<any> => {
    return new Promise(resolve => {
      store.dispatch(setCurrentScene({
        name,
        isTransitioning: true,
      }))
      resolve()
    })
  }

  public addScenes = (sections: Array<any>): void => {
    sections.forEach(section => {
      this.sceneList.push(section)
      store.dispatch(addToSceneList({ scene: section.el }))
    })
  }

  public setDefaultScreen = (name: string): void => {
    this.defaultScene = name
    this.switchScreenPromise(name)
      .then(() => {
        this.setCurrentSceneFromState()
        this.switchSceneChangeOn(true)
      })
  }

  public switchScreen = (name: string): void => {
    this.defaultScene = null
    this.nextScene = { name }
    this.switchScreenPromise(name)
      .then(() => {
        this.switchSceneChangeOn(false)
        this.setCurrentSceneFromState()
      })
  }

  private setCurrentSceneFromState = () => {
    this.currentScene = store.getState().sceneData.currentScene
    /*
     * Instantiate the post-processing
     */
    this.postProcessing()
    this.currentScene.fog = new THREE.Fog(new THREE.Color('#000000'), 600, 1000)
    const interaction = new Interaction(this.renderer, this.currentScene, this.camera)
    interaction.interactionFrequency = 1
    interaction.moveWhenInside = false
    // This is our 'hacky' fade scene method
    setTimeout(() => {
      store.dispatch(sceneSetComplete({ isTransitioning: false }))
    }, 500)
  }

  private switchSceneChangeOn = (setDefault = false) => {
    let data = {
      from: null,
      to: this.defaultScene,
    }
    if (!setDefault) {
      if (this.currentScene.name !== this.nextScene.name) {
        data = {
          from: this.currentScene.name,
          to: this.nextScene.name,
        }
      }
    }
    RootEvent.eventTrigger('sceneChangeStart', data)
    if (!this.frameId) {
      this.animate()
    }
  }

  private animate = () => {
    this.stats.update()
    TWEEN.update()
    this.render()
    this.delta = this.clock.getDelta()
    this.composer.render()
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
      case 'syriaEvent':
        renderSceneFromState = SyriaEventScene
        break
      default:
        break
    }
    renderSceneFromState.update()

    this.camera.position.y += Math.cos(this.cameraShake) / 20
    this.cameraShake += 0.005

    if (this.mouse.mouseX) {
      this.camera.position.x += (this.mouse.mouseX - this.camera.position.x) * 0.08
      // this.camera.position.y += (-this.mouse.mouseY - this.camera.position.y) * 0.005
      this.camera.lookAt(new THREE.Vector3(0, this.camera.position.y, 0))
    }

    this.step += 1

    this.renderer.render(this.scene, this.camera)
  }

  public getCamera = () => this.camera
}
