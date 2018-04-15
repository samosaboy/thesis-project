import {
  Scene,
  TextGeometry,
} from '../../components'
import { RootComponent } from '../App'

const THREE = require('three')

export const Welcome = () => {
  const welcomeScene = new Scene('welcomeScene')

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
      topColor: { value: new THREE.Color('#4e4e5f') },
      bottomColor: { value: new THREE.Color('#0e040a') },
      offset: { value: 100 },
      exponent: { value: 1.1 },
    },
    side: THREE.BackSide,
  })
  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  sky.visible = true
  welcomeScene.add(sky)

  const splashText = new TextGeometry({
    text: 'T H E \n R I P P L E \n E F F E C T',
    options: {
      align: 'left',
      size: 500,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Bold',
      color: '#FFFFFF',
    },
  })

  welcomeScene.add(splashText.text)

  const splashDescription = new TextGeometry({
    text: 'This experiences requires headphones. \n When you are ready, click continue.',
    options: {
      align: 'center',
      size: 200,
      lineSpacing: 10,
      font: 'Lora',
      style: 'Normal',
      color: '#FFFFFF',
      position: {
        x: 0,
        y: -40,
        z: 0,
      },
    },
  })

  splashDescription.text.on('click', () => {
    RootComponent.switchScreen('pondScene')
  })
  splashDescription.text.cursor = 'pointer'

  welcomeScene.add(splashDescription.text)

  welcomeScene.onIn(() => {
    splashText.in()
    splashDescription.in()
  })

  welcomeScene.onOut(() => {
    splashText.out()
    splashDescription.out()
  })

  welcomeScene.onStart(() => {
    sky.visible = true
  })

  welcomeScene.onStop(() => {
    sky.visible = false
  })

  welcomeScene.onUpdate(() => {})

  return welcomeScene
}
