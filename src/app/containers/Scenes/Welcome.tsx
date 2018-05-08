import {
  Icon,
  Scene,
  TextGeometry,
} from '../../components'
import { RootComponent } from '../App'

import * as alphaTexture from './../../../assets/images/textures/alphaMapTexture.png'
import * as mousedownIcon from './../../../assets/images/mouseicondown-sprite.png'

const THREE = require('three')

export const Welcome = () => {
  const welcomeScene = new Scene('welcomeScene')
  welcomeScene.el.position.set(0, 2000, 0)

  const skyGeometry = new THREE.SphereBufferGeometry(3000, 36, 36)
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
      topColor: { value: new THREE.Color('#26262f') },
      bottomColor: { value: new THREE.Color('#0e040a') },
      offset: { value: 100 },
      exponent: { value: 1.1 },
    },
    side: THREE.BackSide,
  })
  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  sky.visible = false
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
      y: 40,
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
    'P L E A S E     P U T     O N     T H E     H E A D P H O N E S.', {
      align: 'center',
      size: 150,
      lineSpacing: 10,
      font: 'Lato',
      style: 'Normal',
      color: '#FFFFFF',
      position: {
        x: 0,
        y: -30,
        z: 0,
      },
    })

  welcomeScene.add(splashDescription.text)

  const button = new TextGeometry(
    'C L I C K', {
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

  const sprite = new Icon(mousedownIcon, {
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

  button.text.on('click', () => {
    RootComponent.switchScreen('welcomeScene', 'pondScene')
  })

  // button.text.on('mousedown', () => {
  //   sprite.in(1000)
  //   splashText.out(500)
  //   splashDescription.out()
  //   keepHolding.in()
  //   mouseDown = true
  // })
  // button.text.on('mouseup', () => {
  //   sprite.out()
  //   splashText.in()
  //   splashDescription.in()
  //   keepHolding.out(500)
  //   mouseDown = false
  // })
  button.text.cursor = 'pointer'

  const geometry = new THREE.IcosahedronGeometry(300, 4)
  const material = new THREE.MeshStandardMaterial({
    color: '#45526c',
    side: THREE.DoubleSide,
    alphaTest: 0.5,
    wireframe: true,
    transparent: true,
  })
  const alphaMap = new THREE.TextureLoader().load(alphaTexture)
  material.alphaMap = alphaMap
  material.alphaMap.magFilter = THREE.NearestFilter
  material.alphaMap.wrapT = material.alphaMap.wrapS = THREE.RepeatWrapping
  material.alphaMap.repeat.yz = 1
  const earthMesh = new THREE.Mesh(geometry, material)
  welcomeScene.add(earthMesh)

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
    earthMesh.material.alphaMap.offset.y = RootComponent.step * 0.001
  })

  return welcomeScene
}
