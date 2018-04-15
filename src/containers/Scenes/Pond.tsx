import {
  BackgroundParticles,
  EventParticles,
  Scene,
  TextGeometry,
} from '../../components'

import { RootComponent } from '../App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export const Pond = () => {
  const pondScene = new Scene('pondScene')

  const titleText = new TextGeometry(
    `T H I S    I S    T H E    U N I V E R S E 
    \n A S    A N    A B S T R A C T I O N.`, {
      align: 'center',
      size: 200,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: 0,
        y: 100,
        z: 0,
      },
    })
  pondScene.add(titleText.text)

  const titleTextDesc = new TextGeometry(
    `T H E    S E A     B E N E A T H     I S     T H E     E A R T H.`, {
      align: 'center',
      size: 150,
      lineSpacing: 20,
      font: 'Lora',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    })
  pondScene.add(titleTextDesc.text)

  const titleTextDesc2 = new TextGeometry(
    `T H E     S T A R S     A B O V E     IS     H U M A N I T Y.`, {
      align: 'center',
      size: 150,
      lineSpacing: 20,
      font: 'Lora',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: 0,
        y: -20,
        z: 0,
      },
    })
  pondScene.add(titleTextDesc2.text)

  /*
   * Surface Plane
   * */
  const planeGeometry = new THREE.BoxBufferGeometry(1000, 1, 1000)
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: '#060615',
  })
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  planeMesh.position.set(0, -75, 0)
  planeMesh.receiveShadow = true
  planeMesh.visible = false

  // pondScene.add(planeMesh)

  /*
   * Light Params
   * */
  const spotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.penumbra = 1 // how soft the spotlight looks
  spotLight.position.set(0, 400, 100)
  pondScene.add(spotLight)

  const shadowLight = new THREE.SpotLight(0xFFFFFF)
  shadowLight.penumbra = 1 // how soft the shadowLight looks
  shadowLight.position.set(0, 200, 100)
  shadowLight.castShadow = true
  shadowLight.shadow.mapSize.width = 100
  shadowLight.shadow.mapSize.height = 100

  pondScene.add(shadowLight)

  const skyBox = new THREE.HemisphereLight('#373f52', '#0e0e1d')
  skyBox.position.set(0, 0, 0)
  pondScene.add(skyBox)

  const skyGeometry = new THREE.SphereBufferGeometry(1000, 2, 2)
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
      exponent: { value: 20 },
    },
    side: THREE.BackSide,
  })
  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  sky.visible = false

  pondScene.add(sky)

  const backgroundParticles = new BackgroundParticles({
    count: 10000,
    particleSize: 0.9,
  })
  pondScene.add(backgroundParticles.getElement())

  const SyriaEvent = new EventParticles({
    x: 0,
    y: 50,
    z: 0,
  })
  pondScene.add(SyriaEvent.getElement())

  /*
   * *
   * *
   * TEST *
   * *
   * *
   * */

  const geometry = new THREE.PlaneBufferGeometry(1000, 1000, 120, 120)
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
  const colors = new THREE.BufferAttribute(new Float32Array(60 * 3 * 4), 4)

  geometry.addAttribute('color', colors)

  const uniforms = {
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
      value: 9.0,
    },
  }

  const shaderMaterial = new THREE.ShaderMaterial({
    wireframe: true,
    transparent: true,
    uniforms,
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

  // color.r += y / radius;
  // color.g +=  1.0 - (y / radius); // it will be green near to the ground
  // color.b += y * 2.0 / radius;
  // color.a = vPosition.y / radius;

  const terrainMesh = new THREE.Mesh(geometry, shaderMaterial)
  terrainMesh.position.set(0, -150, -300)
  terrainMesh.rotateY(110)
  pondScene.add(terrainMesh)

  /*
   * *
   * *
   * TEST *
   * *
   * *
   * */

  pondScene.onIn(() => {
    // SyriaEvent.in(1500)
    titleText.in()
    titleTextDesc.in()
    titleTextDesc2.in()
    backgroundParticles.in()
  })

  pondScene.onOut(() => {
    SyriaEvent.out()
    titleText.out()
    titleTextDesc.out()
    titleTextDesc2.out()
    backgroundParticles.out()
  })

  pondScene.onStart(() => {
    sky.visible = true
    planeMesh.visible = true
  })

  pondScene.onStop(() => {
    sky.visible = false
    planeMesh.visible = false
  })

  pondScene.onUpdate(() => {
    sky.rotation.z += 0.001
    uniforms.time.value += 0.05
    SyriaEvent.updateCameraPosition(RootComponent.getCamera().position)
    backgroundParticles.animateParticles()
  })

  return pondScene
}
