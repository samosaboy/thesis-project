import {
  Icon,
  Scene,
  TextGeometry,
} from '../../components'
import { RootComponent } from '../App'
import { TextureAnimator } from '../../components/Utils'

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

  const light = new THREE.DirectionalLight(0xFFFFFF, 0.2)
  light.position.set(0, 0, 300)
  // welcomeScene.add(light)

  // const iconTexture = new THREE.ImageUtils.loadTexture('../../public/images/mouseicondown-sprite.png')
  // const icon = new TextureAnimator(iconTexture, 1, 70, 70, 1)
  // const material = new THREE.MeshStandardMaterial({ map: icon.get(), side: THREE.DoubleSide })
  // const geometry = new THREE.PlaneGeometry(50, 50, 1, 1)
  // const sprite = new THREE.Mesh(geometry, material)
  const sprite = new Icon('../../public/images/mouseicondown-sprite.png', {
    horizontal: 1,
    vertical: 70,
    total: 70,
    duration: 2
  })
  sprite.el().scale.set(0.6, 0.8, 0.8)
  sprite.el().position.set(0, -80, 0)
  welcomeScene.add(sprite.el())

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

  welcomeScene.onUpdate(() => {
    sprite.update(1000 * RootComponent.delta)
  })

  return welcomeScene
}
