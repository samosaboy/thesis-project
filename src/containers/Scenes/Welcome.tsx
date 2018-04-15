import {
  Icon,
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

  const bgSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(200, 36, 36),
    new THREE.MeshLambertMaterial({ color: '#a8a8a8' }),
  )

  bgSphere.position.set(0, 0, -200)

  welcomeScene.add(bgSphere)

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
    'This experiences requires headphones. \n When you are ready, hold over this text.', {
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

  const light = new THREE.DirectionalLight(0xFFFFFF, 0.02)
  light.position.set(0, 0, 300)
  welcomeScene.add(light)

  const sprite = new Icon('../../public/images/mouseicondown-sprite.png', {
    horizontal: 1,
    vertical: 70,
    total: 70,
    duration: 0.5,
    position: {
      x: 0,
      y: -80,
      z: 0,
    },
  })
  sprite.el().scale.set(0.4, 0.6, 0.4)
  welcomeScene.add(sprite.el())

  let time = 0
  let mouseDown

  splashDescription.text.on('mousedown', () => {
    sprite.in()
    splashText.out(500)
    keepHolding.in()
    mouseDown = true
  })
  splashDescription.text.on('mouseup', () => {
    sprite.out()
    splashText.in()
    keepHolding.out(500)
    mouseDown = false
  })
  splashDescription.text.cursor = 'pointer'

  welcomeScene.onIn(() => {
    splashText.in()
    splashDescription.in()
  })

  welcomeScene.onOut(() => {
    splashText.out()
    splashDescription.out()
    sprite.out()
  })

  welcomeScene.onStart(() => {
    sky.visible = true
  })

  welcomeScene.onStop(() => {
    sky.visible = false
  })

  welcomeScene.onUpdate(() => {
    sprite.update(1000 * RootComponent.delta)

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
