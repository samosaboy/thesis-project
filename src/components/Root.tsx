/* So here we basically need to define a Scene that we can use to instantiate
 * all of our components. I need to be able to declare const pool = new Scene()
 * and then trigger animations on click events and delete everything afterwards
 *
 * Should each scene have its own camera, renderer, requestAnimationFrame etc???
 */

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

export class Root {
  // three setup
  private scene: THREE.Scene | any
  private camera: THREE.PerspectiveCamera | any
  private renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private mouse: THREE.Vector2 | any
  private raycaster: THREE.Raycaster
  private vector: THREE.Vector3
  public intersects: any
  private clock: THREE.Clock

  // stats
  private stats: any

  constructor() {
    /*
     * Basic THREE setup
     * */

    this.scene = new THREE.Scene()
    this.scene.name = 'mainScene'
    this.scene.fog = new THREE.Fog(new THREE.Color(0xe0e0e0), 1, 5000)
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000)
    this.camera.position.set(0, 0, 300)
    this.renderer = new THREE.WebGLRenderer({
      antialias: (window.devicePixelRatio === 1),
      fov: 60,
    })
    this.mouse = new THREE.Vector2()
    this.scene.updateMatrixWorld()
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

  public createScene = () => {
    // Plane
    const planeGeometry = new THREE.BoxBufferGeometry(6000, 10, 10000)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: '#060615',
      dithering: true,
    })
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    planeMesh.position.set(0, -50, 0)
    planeMesh.receiveShadow = true

    this.scene.add(planeMesh)

    /*
     * Light Params
     * */
    const spotLight = new THREE.SpotLight(0xFFFFFF)
    spotLight.penumbra = 1 // how soft the spotlight looks
    spotLight.position.set(0, 200, 0)
    this.scene.add(spotLight)

    const shadowLight = new THREE.SpotLight(0xFFFFFF)
    shadowLight.penumbra = 1 // how soft the shadowLight looks
    shadowLight.position.set(0, 200, 100)
    shadowLight.castShadow = true
    shadowLight.shadow.mapSize.width = 100
    shadowLight.shadow.mapSize.height = 100
    this.scene.add(shadowLight)

    const skyBox = new THREE.HemisphereLight('#373f52', '#0e0e1d')
    skyBox.position.set(0, 50, 0)
    this.scene.add(skyBox)

    const skyGeometry = new THREE.SphereGeometry(600, 32, 15)
    const skyMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
      fragmentShader: `uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
			varying vec3 vWorldPosition;
			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
			}`,
      uniforms: {
        topColor: { value: new THREE.Color('#141418') },
        bottomColor: { value: new THREE.Color('#262c3c') },
        offset: { value: 100 },
        exponent: { value: 1.1 },
      },
      side: THREE.BackSide,
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    this.scene.add(sky)
  }
}