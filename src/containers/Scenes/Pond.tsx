import {
  BackgroundParticles,
  Scene,
  TextGeometry,
} from '../../components'

const THREE = require('three')

export const Pond = () => {
  const pondScene = new Scene('pondScene')

  const titleText = new TextGeometry({
    text: 'Pick a country',
    options: {
      align: 'left',
      size: 500,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Bold',
      color: '#FFFFFF',
    },
  })
  pondScene.add(titleText.text)

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

  pondScene.add(planeMesh)

  /*
   * Light Params
   * */
  const spotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.penumbra = 1 // how soft the spotlight looks
  spotLight.position.set(0, 200, 0)
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

  const skyGeometry = new THREE.SphereBufferGeometry(1000, 1, 1)
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
  sky.visible = false

  pondScene.add(sky)

  const backgroundParticles = new BackgroundParticles({
    count: 1000,
    particleSize: 1.2,
    rangeY: [
      -200,
      200,
    ],
  })
  pondScene.add(backgroundParticles.getElement())

  pondScene.onIn(() => {
    titleText.in()
    backgroundParticles.in()
  })

  pondScene.onOut(() => {
    titleText.out()
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
    backgroundParticles.animateParticles()
  })

  return pondScene
}
