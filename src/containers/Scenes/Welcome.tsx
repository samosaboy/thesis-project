import {
  Icon,
  Scene,
  TextGeometry,
} from '../../components'
import { RootComponent } from '../App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

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
      topColor: { value: new THREE.Color('#16161b') },
      bottomColor: { value: new THREE.Color('#0e040a') },
      offset: { value: 100 },
      exponent: { value: 1.1 },
    },
    side: THREE.BackSide,
  })
  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  sky.visible = true
  welcomeScene.add(sky)

  const splashText = new TextGeometry('T H E \n R I P P L E \n E F F E C T', {
    align: 'left',
    size: 500,
    lineSpacing: 20,
    font: 'Lato',
    style: 'Bold',
    color: '#FFFFFF',
    position: {
      x: 0,
      y: 20,
      z: 0,
    },
  })

  welcomeScene.add(splashText.text)

  const keepHolding = new TextGeometry('K E E P \n H O L D I N G', {
    align: 'left',
    size: 500,
    lineSpacing: 20,
    font: 'Lato',
    style: 'Bold',
    color: '#FFFFFF',
    position: {
      x: 0,
      y: 20,
      z: 0,
    },
  })

  welcomeScene.add(keepHolding.text)

  const splashDescription = new TextGeometry(
    'This experiences requires headphones.', {
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
    })

  welcomeScene.add(splashDescription.text)

  const button = new TextGeometry(
    'H O L D', {
      align: 'center',
      size: 200,
      lineSpacing: 10,
      font: 'Lato',
      style: 'Normal',
      color: '#FFFFFF',
      label: true,
      position: {
        x: 0,
        y: -80,
        z: 0,
      },
    })

  welcomeScene.add(button.text)

  const light = new THREE.DirectionalLight(0xFFFFFF, 2)
  light.position.set(0, 0, -100)
  welcomeScene.add(light)

  const sprite = new Icon('../../public/images/mouseicondown-sprite.png', {
    horizontal: 1,
    vertical: 70,
    total: 70,
    duration: 60,
    position: {
      x: 0,
      y: -40,
      z: 0,
    },
  })
  sprite.el().scale.set(0.4, 0.6, 0.4)
  welcomeScene.add(sprite.el())

  let time = 0
  let mouseDown

  button.text.on('mousedown', () => {
    sprite.in(1000)
    splashText.out(500)
    splashDescription.out()
    keepHolding.in()
    mouseDown = true
  })
  button.text.on('mouseup', () => {
    sprite.out()
    splashText.in()
    splashDescription.in()
    keepHolding.out(500)
    mouseDown = false
  })
  button.text.cursor = 'pointer'

  const geometry = new THREE.IcosahedronGeometry(300, 4)
  const material = new THREE.MeshStandardMaterial({
    color: '#101319',
    side: THREE.DoubleSide,
    alphaTest: 0.5,
    wireframe: true,
    transparent: true,
  })
  const alphaMap = new THREE.TextureLoader().load('../public/images/textures/alphaMapTexture.png')
  material.alphaMap = alphaMap
  material.alphaMap.magFilter = THREE.NearestFilter
  material.alphaMap.wrapT = material.alphaMap.wrapS = THREE.RepeatWrapping
  material.alphaMap.repeat.yz = 1
  const tube = new THREE.Mesh(geometry, material)
  tube.position.set(-200, 0, -200)

  welcomeScene.add(tube)

  welcomeScene.onIn(() => {
    button.in()
    splashText.in()
    splashDescription.in()
  })

  welcomeScene.onOut(() => {
    button.out()
    splashText.out()
    splashDescription.out()
    sprite.out()
  })

  welcomeScene.onStart(() => {
    sky.visible = true
    alphaMap.visible = true
  })

  welcomeScene.onStop(() => {
    sky.visible = false
    alphaMap.visible = false
  })

  welcomeScene.onUpdate(() => {
    sprite.update(1000 * RootComponent.delta)
    tube.material.alphaMap.offset.y = RootComponent.step * 0.001

    if (mouseDown) {
      time += 1 / 60
      if (time > 4) {
        RootComponent.switchScreen('pondScene')
      }
    } else {
      time = 0
    }
  })

  return welcomeScene
}
