import { Interaction } from 'three.interaction'

import {
  BloomPass,
  EffectComposer,
  RenderPass,
  ShockWavePass,
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
import 'three/crossfadeScene'
import { RootEvent } from '../containers/App'
import { store } from '../index'
import { setCurrentScene } from '../actions/actions'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

export const isDev = window.location.host.indexOf('localhost:3000') !== -1

// Look how they implement animation:
// https://github.com/zadvorsky/three.bas/blob/master/examples/_js/root.js

// TODO: Implement loading screen with TextureLoader and LoadingManager
// put stuff into an array
// https://threejs.org/docs/#api/loaders/managers/LoadingManager

export class Root {
  private devicePixelRatio: number
  private camera: THREE.PerspectiveCamera | any
  private renderer: THREE.WebGLRenderer
  private frameId: any
  private mouse: THREE.Vector2 | any
  private clock: THREE.Clock
  private composer: any
  private stats: any
  private sceneList: Array<any>
  private currentScene: any
  private nextScene: any
  private defaultScene: any

  public step: number
  public delta: number

  private cameraSpeed: number
  private cameraShake: number

  private scene: THREE.Scene
  public backToEvent: boolean

  public sceneTransitionTime: number

  public listener: THREE.AudioListener

  public loadingManager: THREE.LoadingManager
  public isLoaded: boolean

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
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
    })
    this.composer = new THREE.EffectComposer(this.renderer)
    this.composer.setSize(window.innerWidth * this.devicePixelRatio, window.innerHeight * this.devicePixelRatio)
    this.mouse = new THREE.Vector2()
    this.clock = new THREE.Clock()
    this.scene.add(this.camera)

    /*
     * Instantiate Stats for Development
     * */
    if (isDev) {
      this.stats = new Stats()
      this.stats.showPanel(0)
      this.stats.dom.style.right = 0
      this.stats.dom.style.left = 'auto'
      document.body.appendChild(this.stats.dom)
    }

    this.step = 0
    this.cameraSpeed = 1
    this.cameraShake = 0
    this.sceneTransitionTime = 2000

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
    THREE.Camera.prototype.resetPosition = () => {
      new TWEEN.Tween(this.camera.position)
        .to({
          x: 0,
          y: 0,
          z: 300,
        }, this.cameraSpeed * 2000)
        .easing(TWEEN.Easing.Cubic.InOut).start()
    }

    THREE.Camera.prototype.resetZoom = () => {
      new TWEEN.Tween(this.camera.rotation)
        .to({
          x: 0,
          y: 0,
          z: 0,
        }, this.cameraSpeed * 2000)
        .easing(TWEEN.Easing.Cubic.InOut).start()
    }

    THREE.Camera.prototype.zoom = object => {
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

    /*
     * Set up LoadingManager
     */
    this.loadingManager = new THREE.LoadingManager()
  }

  public setContainer = (container) => {
    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight,
    )
    this.renderer.setPixelRatio(this.devicePixelRatio)
    container.appendChild(this.renderer.domElement)
  }

  public handleMouseMove = (event) => {
    this.mouse.mouseX = (event.clientX - (window.innerWidth / 2)) / 12
    this.mouse.mouseY = (event.clientY - (window.innerHeight / 2)) / 6
  }

  public handleWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.composer.setSize(window.innerWidth * this.devicePixelRatio, window.innerHeight * this.devicePixelRatio)
  }


  public addScenes = (sections: Array<any>): void => {
    sections.forEach(section => {
      this.sceneList[section.el.name] = section
      this.scene.add(section.el)
    })
  }

  public setDefaultScreen = (name: string): void => {
    store.dispatch(setCurrentScene({
      isTransitioning: true,
    }))
    this.defaultScene = this.sceneList[name]
    this.camera.position.set(
      this.defaultScene.el.position.x,
      this.defaultScene.el.position.y,
      this.defaultScene.el.position.z + 300,
    )
    setTimeout(() => {
      store.dispatch(setCurrentScene({
        isTransitioning: false,
      }))
      this.switchSceneChangeOn(true)
    }, this.sceneTransitionTime)
  }

  public switchScreen = (from?: string, to?: string): any => {
    this.defaultScene = null
    this.currentScene = this.sceneList[from]
    this.nextScene = this.sceneList[to]
    new TWEEN.Tween(this.camera.position)
      .to({
        x: this.nextScene.el.position.x,
        y: this.nextScene.el.position.y,
        z: this.nextScene.el.position.z + 300,
      }, this.sceneTransitionTime)
      .easing(TWEEN.Easing.Circular.InOut)
      .onStart(() => {
        store.dispatch(setCurrentScene({
          isTransitioning: true,
        }))
      })
      .onComplete(() => {
        store.dispatch(setCurrentScene({
          isTransitioning: false,
        }))
        this.switchSceneChangeOn(false)
      })
      .start()
  }

  private postProcessing = () => {
    if (!this.composer.passes.length) {
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera))
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
  }

  private startPostAndControls = () => {
    /*
     * Instantiate the post-processing
     */
    this.postProcessing()
    this.scene.fog = new THREE.Fog(new THREE.Color('#151515'), 250, 2300)
    const interaction = new Interaction(this.renderer, this.scene, this.camera)
    interaction.interactionFrequency = 1
    interaction.moveWhenInside = false
  }

  private switchSceneChangeOn = (isDefault: boolean = false) => {
    const data = {
      from: isDefault ? null : this.currentScene.el.name,
      to: isDefault ? this.defaultScene.el.name : this.nextScene.el.name,
    }
    RootEvent.eventTrigger('sceneChangeStart', data)
    this.startPostAndControls()
    if (!this.frameId) {
      this.animate()
    }
  }

  private animate = () => {
    if (isDev) this.stats.update()
    TWEEN.update()
    this.render()
    this.composer.render()
    this.delta = this.clock.getDelta()
    this.frameId = requestAnimationFrame(this.animate)
  }

  private render = () => {
    if (this.defaultScene) {
      this.defaultScene.update()
    } else {
      this.nextScene.update()
    }

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
