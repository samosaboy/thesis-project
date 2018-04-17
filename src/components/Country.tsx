import { TextGeometry } from './index'
import { RootComponent } from '../containers/App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export class Country {
  // Text for each country
  public countryName: string
  public des: string

  // Gettable elements
  public title: any
  public description: any
  public backButton: any

  // Geometries
  public sky: any
  public terrain: any
  private uniforms: any

  constructor(props) {
    this.countryName = props.countryName
    this.des = props.description

    const skyGeometry = new THREE.SphereBufferGeometry(400, 4, 4)
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
        topColor: { value: new THREE.Color('#37414b') },
        bottomColor: { value: new THREE.Color('#141619') },
        offset: { value: 400 },
        exponent: { value: 10 },
      },
      side: THREE.BackSide,
    })
    this.sky = new THREE.Mesh(skyGeometry, skyMaterial)
    this.sky.visible = false

    const geometry = new THREE.PlaneBufferGeometry(window.innerWidth * 1.5, window.innerHeight * 1.5, 100, 100)
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    const colors = new THREE.BufferAttribute(new Float32Array(60 * 3 * 4), 4)

    geometry.addAttribute('color', colors)

    this.uniforms = {
      time: {
        type: 'f',
        value: 1.0,
      },
      planeSize: {
        type: 'f',
        value: 100,
      },
      radius: {
        type: 'f',
        value: 10,
      },
    }

    const shaderMaterial = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms: this.uniforms,
      vertexShader: `attribute float vertexPos;
      attribute vec4 color;
      uniform float time;
      uniform float radius;
      uniform float planeSize;
      varying vec3 vPosition;
      varying vec4 vColor;
      void main() {
        float angInc = 3.1416 / planeSize;
        float angle = (position.x  + position.z + planeSize) / 2.0 ;
        vPosition = position;
        vPosition.y += sin(angle * angInc + time) * radius + radius;
        vec4 myPos = modelViewMatrix * vec4(vPosition, 1.0);
        gl_Position = projectionMatrix * myPos;
      }`,
      fragmentShader: `varying vec3 vPosition;
      varying vec4 vColor;
      uniform float time;
      uniform float radius;
      void main() {
        vec4 color = vec4( vColor );
        float gray = dot(color.rgba, vec4(0.299, 0.587, 0.114, 0.9));
        gl_FragColor = vec4(vec3(gray), vPosition.y / radius);
      }`,
    })

    this.terrain = new THREE.Mesh(geometry, shaderMaterial)
    this.terrain.visible = false
    this.terrain.position.set(0, 0, -25)
    this.terrain.rotateX(1.5)

    // this.backButton = new TextGeometry(
    //   'B A C K', {
    //     align: 'center',
    //     size: 200,
    //     lineSpacing: 10,
    //     font: 'Lato',
    //     style: 'Normal',
    //     color: '#FFFFFF',
    //     label: true,
    //     position: {
    //       x: -190,
    //       y: 180,
    //       z: 0,
    //     },
    //   })
    //
    // this.backButton.text.cursor = 'pointer'
    // this.backButton.text.on('click', () => {
    //   RootComponent.backToEvent = true
    //   RootComponent.switchScreen('pondScene')
    // })

    this.title = new TextGeometry(
      this.countryName.split('').join(' ').toUpperCase(), {
        align: 'center',
        size: 200,
        lineSpacing: 20,
        font: 'Lato',
        style: 'Bold',
        color: '#cbcbcb',
        position: {
          x: 0,
          y: 190,
          z: 0,
        },
      },
    )

    this.description = new TextGeometry(
      this.des.toUpperCase(), {
        align: 'center',
        size: 150,
        lineSpacing: 20,
        font: 'Lora',
        style: 'Normal',
        color: '#cbcbcb',
        position: {
          x: 0,
          y: 175,
          z: 0,
        },
      },
    )
  }

  public update = () => {
    this.uniforms.time.value += 0.02
  }
}
