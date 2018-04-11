const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Stats = require('three/stats')

import { AnimateFloor } from './AnimateFloor'

import * as Delaunay from './Utils/delaunay.js'

// Look how they implement animation:
// https://github.com/zadvorsky/three.bas/blob/master/examples/_js/root.js

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

  // test
  private geometry
  private animation

  constructor() {
    /*
     * Basic THREE setup
     * */

    this.scene = new THREE.Scene()
    this.scene.name = 'mainScene'
    this.scene.fog = new THREE.Fog(new THREE.Color('#262c3c'), 300, 600)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000)
    this.camera.position.set(0, 100, 300)
    this.renderer = new THREE.WebGLRenderer({
      antialias: (window.devicePixelRatio === 1),
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
    /*
     * Surface Plane
     * */
    const planeGeometry = new THREE.BoxBufferGeometry(100000, 10, 1000)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: '#060615',
      dithering: false,
    })

    // const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    // planeMesh.position.set(0, -50, 0)
    // planeMesh.receiveShadow = true
    // this.scene.add(planeMesh)

    /*
     *
     * *
     * *
     * *
     * START TEST
     * *
     * *
     * *
     *
     */

    let vertices = [],
      indices,
      i

    const Phi = Math.PI * (3 - Math.sqrt(5))
    const n = 10000
    const radius = 500
    const noise = 6

    for (i = 0; i <= n; i++) {
      const t = i * Phi
      const r = Math.sqrt(i) / Math.sqrt(n)
      const x = r * Math.cos(t) * (radius - THREE.Math.randFloat(0, noise))
      const y = r * Math.sin(t) * (radius - THREE.Math.randFloatSpread(0, noise))

      vertices.push([x, y])
    }

    indices = Delaunay.triangulate(vertices)

    const pointsX = []
    const pointsY = []
    const segmentsX = 3
    const segmentsY = 3

    for (i = 0; i <= segmentsX; i++) {
      pointsX.push(new THREE.Vector3(
        THREE.Math.mapLinear(i, 0, segmentsX, -radius, radius),
        0,
        (i === 0 || i === segmentsX) ? 0 : -THREE.Math.randFloat(64, 72),
      ))
    }

    for (i = 0; i <= segmentsY; i++) {
      pointsY.push(new THREE.Vector3(
        0,
        THREE.Math.mapLinear(i, 0, segmentsY, -radius, radius),
        (i === 0 || i === segmentsY) ? 0 : -THREE.Math.randFloat(64, 72),
      ))
    }

    const splineX = new THREE.CatmullRomCurve3(pointsX)
    const splineY = new THREE.CatmullRomCurve3(pointsY)

    const geometry = new THREE.Geometry()
    const shapeScale = 1

    for (i = 0; i < indices.length; i += 3) {
      // build the face
      let v0 = vertices[indices[i]]
      let v1 = vertices[indices[i + 1]]
      let v2 = vertices[indices[i + 2]]

      // calculate centroid
      const cx = (v0[0] + v1[0] + v2[0]) / 3
      const cy = (v0[1] + v1[1] + v2[1]) / 3

      // translate, scale, un-translate
      v0 = [(v0[0] - cx) * shapeScale + cx, (v0[1] - cy) * shapeScale + cy]
      v1 = [(v1[0] - cx) * shapeScale + cx, (v1[1] - cy) * shapeScale + cy]
      v2 = [(v2[0] - cx) * shapeScale + cx, (v2[1] - cy) * shapeScale + cy]

      // draw the face to a shape
      const shape = new THREE.Shape()
      shape.moveTo(v0[0], v0[1])
      shape.lineTo(v1[0], v1[1])
      shape.lineTo(v2[0], v2[1])

      // use the shape to create a geometry
      const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
        amount: 1,
        bevelEnabled: false,
      })

      // offset z vector components based on the two splines
      for (let j = 0; j < shapeGeometry.vertices.length; j++) {
        const v = shapeGeometry.vertices[j]
        const ux = THREE.Math.clamp(THREE.Math.mapLinear(v.x, -radius, radius, 0.0, 1.0), 0.0, 1.0)
        const uy = THREE.Math.clamp(THREE.Math.mapLinear(v.y, -radius, radius, 0.0, 1.0), 0.0, 1.0)

        v.z += splineX.getPointAt(ux).z
        v.z += splineY.getPointAt(uy).z
      }

      // merge into the whole
      geometry.merge(shapeGeometry)
    }

    this.geometry = geometry

    this.geometry.center()
    this.geometry.rotateX(-Math.PI / 2)

    // const planeMesh = new THREE.Mesh(this.geometry, planeMaterial)
    // planeMesh.name = 'asset:Floor'
    // planeMesh.position.set(0, -50, 0)
    // planeMesh.receiveShadow = true
    // this.scene.add(planeMesh)
    this.animation = new AnimateFloor(this.geometry)
    // this.animation.receiveShadow = true
    this.scene.add(this.animation)

    /*
     *
     * *
     * *
     * *
     * END TEST
     * *
     * *
     * *
     *
     */


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

    const skyGeometry = new THREE.SphereBufferGeometry(1000, 6, 6)
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
        topColor: { value: new THREE.Color('#0a0a0c') },
        bottomColor: { value: new THREE.Color('#262c3c') },
        offset: { value: 100 },
        exponent: { value: 1.1 },
      },
      side: THREE.BackSide,
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    this.scene.add(sky)
  }

  animateFloor = (event) => {
    const px = window.innerWidth / event.offsetX
    const py = event.clientY / window.innerHeight

    this.animation.material.uniforms['uD'].value = 2 + px * 8
    this.animation.material.uniforms['uA'].value = py * 16

    this.animation.material.uniforms['roughness'].value = px
    this.animation.material.uniforms['metalness'].value = py
  }
}
