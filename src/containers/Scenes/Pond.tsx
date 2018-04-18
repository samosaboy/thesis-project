import {
  BackgroundParticles,
  EventParticles,
  Icon,
  Scene,
  TextGeometry,
} from '../../components'

import {
  PondScene,
  RootComponent,
} from '../App'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export const Pond = () => {
  const pondScene = new Scene('pondScene')
  pondScene.el.position.set(0, 0, 0)
  pondScene.el.visible = false

  /*
   * Step 1
   * */

  const step1TextTitle = new TextGeometry(
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
  pondScene.add(step1TextTitle.text)

  const step1TextDesc1 = new TextGeometry(
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
  pondScene.add(step1TextDesc1.text)

  const step1TextDesc2 = new TextGeometry(
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
  pondScene.add(step1TextDesc2.text)

  const Step1ContinueButton = new TextGeometry(
    'C O N T I N U E', {
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
  pondScene.add(Step1ContinueButton.text)

  /*
   * Step 2
   * */

  const sprite = new Icon('../../public/images/mouseiconmove-sprite.png', {
    horizontal: 15,
    vertical: 21,
    total: 300,
    duration: 10000,
    position: {
      x: 0,
      y: 70,
      z: 0,
    },
  })
  sprite.el().rotation.x = 120
  sprite.el().scale.set(0.8, 0.65, 0.8)
  pondScene.add(sprite.el())

  const step2TextTitle = new TextGeometry(
    `E V E N T S     A R E     E X P L O R A B L E
    \n I N     T H E     F O R M     O F     S O U N D.`, {
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
  pondScene.add(step2TextTitle.text)

  const step2TextDesc1 = new TextGeometry(
    `T H E     S E A     P R O P O G A T E S     E V E N T S     T H A T
    \n O C C U R     A R O U N D     T H E     W O R L D.
    \n W E     C O L L E C T I V E L Y     F E E L     T H E     R I P P L E S
    \n O F     E A C H     E V E N T     T H A T     O C C U R S.`, {
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
  pondScene.add(step2TextDesc1.text)

  /*
   * Step 3
   * */

  const step3TextDesc1 = new TextGeometry(
    `T H R O U G H O U T     T H I S     E X P E R I E N C E
    \n U S E     Y O U R     M O U S E     T O     R O T A T E     A R O U N D.`, {
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
  pondScene.add(step3TextDesc1.text)

  const Step2ContinueButton = new TextGeometry(
    'C O N T I N U E', {
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
  pondScene.add(Step2ContinueButton.text)

  const Step3ContinueButton = new TextGeometry(
    'B E G I N', {
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
  pondScene.add(Step3ContinueButton.text)

  Step1ContinueButton.text.cursor = 'pointer'
  Step1ContinueButton.text.on('pointerdown', () => {
    //step1 out
    step1TextTitle.out()
    step1TextDesc1.out()
    step1TextDesc2.out()
    Step1ContinueButton.out()

    Step2ContinueButton.in()
    step2TextTitle.in()
    step2TextDesc1.in(2000)

  })

  Step2ContinueButton.text.cursor = 'pointer'
  Step2ContinueButton.text.on('click', () => {
    step2TextDesc1.out()
    step2TextTitle.out()
    Step2ContinueButton.out()
    // Whatever is at the end is what you put in onOut()
    sprite.in(1000)
    step3TextDesc1.in(2000)
    Step3ContinueButton.in()
  })

  const eventViewHelperText = new TextGeometry(
    `C H O O S E     A     C O U N T R Y     T O     S T A R T     E X P L O R I N G`, {
      align: 'center',
      size: 150,
      lineSpacing: 20,
      font: 'Lora',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: 0,
        y: -150,
        z: 200,
      },
    })
  pondScene.add(eventViewHelperText.text)

  /*
  *
  *
  * START Events
  *
  *
  * */

  // SYRIA EVENT

  const SyriaEvent = new EventParticles({
    x: 0,
    y: 50,
    z: 50,
  })
  pondScene.add(SyriaEvent.getElement())

  const SyriaEventTitle = new TextGeometry(
    'S Y R I A', {
      align: 'center',
      size: 200,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: SyriaEvent.getElement().position.x,
        y: SyriaEvent.getElement().position.y + 150,
        z: SyriaEvent.getElement().position.z,
      },
    },
  )

  pondScene.add(SyriaEventTitle.text)

  // SyriaEvent.in() // uncomment for testing
  Step3ContinueButton.text.cursor = 'pointer'
  Step3ContinueButton.text.on('click', () => {
    sprite.out()
    step3TextDesc1.out()
    Step3ContinueButton.out()

    // Event in
    eventViewHelperText.in()
    SyriaEvent.in()
  })

  SyriaEvent.getElement().cursor = 'pointer'
  SyriaEvent.getElement().on('mouseover', (q) => {
    SyriaEvent.hoverIn()
    SyriaEventTitle.in(500)
  })
  SyriaEvent.getElement().on('mouseout', () => {
    SyriaEvent.hoverOut()
    SyriaEventTitle.out(500)
  })

  SyriaEvent.getElement().on('click', () => {
    SyriaEvent.hoverOut()
    SyriaEventTitle.out(500)
    RootComponent.switchScreen('syriaEvent')
    // RootComponent.getCamera().zoom(SyriaEvent.getElement())
    //   .then(() => {
    //     syriaEventClick = false
    //     RootComponent.switchScreen('syriaEvent')
    //   })
  })

  /*
   *
   *
   * END Events
   *
   *
   * */

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
  spotLight.position.set(0, 300, 200)
  spotLight.visible = false
  pondScene.add(spotLight)

  // const skyBox = new THREE.HemisphereLight('#373f52', '#0e0e1d')
  // skyBox.position.set(0, 0, 0)
  // pondScene.add(skyBox)

  const skyGeometry = new THREE.SphereBufferGeometry(1000, 5, 5)
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
      exponent: { value: 40 },
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
  backgroundParticles.getElement().visible = false
  pondScene.add(backgroundParticles.getElement())

  const geometry = new THREE.PlaneBufferGeometry(2000, 2000, 300, 300)
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
      value: 9,
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

  const terrainMesh = new THREE.Mesh(geometry, shaderMaterial)
  terrainMesh.visible = false
  terrainMesh.position.set(0, -150, -500)
  pondScene.add(terrainMesh)

  pondScene.onIn(() => {
    if (!RootComponent.backToEvent) {
      step1TextDesc2.in(3000)
      step1TextDesc1.in(3000)
      step1TextTitle.in(2000)
      Step1ContinueButton.in(5000)
    } else {
      SyriaEvent.in()
      eventViewHelperText.in()
    }
    backgroundParticles.in()
    SyriaEvent.getElement().cursor = 'pointer'
    SyriaEvent.getElement().on('mouseover', () => {
      SyriaEvent.hoverIn()
      SyriaEventTitle.in(500)
    })
  })

  pondScene.onOut(() => {
    step1TextDesc2.out()
    step1TextDesc1.out()
    step1TextTitle.out()
    Step1ContinueButton.out()
    SyriaEvent.out()
    eventViewHelperText.out()
    backgroundParticles.out()
  })

  pondScene.onStart(() => {
    backgroundParticles.getElement().visible = true
    pondScene.el.visible = true
    sky.visible = true
    planeMesh.visible = true
    terrainMesh.visible = true
    spotLight.visible = true
  })

  pondScene.onStop(() => {
    backgroundParticles.getElement().visible = false
    pondScene.el.visible = false
    sky.visible = false
    planeMesh.visible = false
    terrainMesh.visible = false
    spotLight.visible = false
  })

  pondScene.onUpdate(() => {
    sky.rotation.z += 0.001
    uniforms.time.value += 0.05
    SyriaEvent.updateCameraPosition(RootComponent.getCamera().position)
    backgroundParticles.animateParticles()
  })

  return pondScene
}
