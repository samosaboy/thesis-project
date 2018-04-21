import {
  BackgroundParticles,
  EventParticles,
  Icon,
  Ripple,
  Scene,
  TextGeometry,
  WaveAudio,
} from '../../components'

import { RootComponent } from '../App'

const THREE = require('three')

export const Pond = () => {
  const pondScene = new Scene('pondScene')
  pondScene.el.position.set(0, 0, 0)

  const pondAudio = new WaveAudio('../../public/media/pond_sound.wav', {
    volume: 2,
    interval: -1,
    loop: true
  })

  /*
   * Step 1
   * */

  const step1TextTitle = new TextGeometry(
    `T H I S    I S    T H E    E A R T H
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
    `I N    T H I S    R E P R E S E N T A T I O N,    T H E    W O R L D
    \n I S    C O N D E N S E D    I N T O    A    P O N D.
    \n \n T H E    S E A    B E N E A T H    I S    T H E    E A R T H    A N D    T H E
    \n S T A R S    A B O V E    A R E    H U M A N S.`, {
      align: 'center',
      size: 150,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    })
  pondScene.add(step1TextDesc1.text)

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
    horizontal: 16,
    vertical: 20,
    total: 300,
    duration: 1,
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
    `I N    T H I S    A B S T R A C T I O N,    E V E N T S     T H A T
    \n O C C U R    I N     T H E    S E A    P R O P O G A T E    T O    T H E
    \n T H E    G R E A T E S T    D I S T A N C E S    T O    U S.`, {
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
    `E A C H    P R O P O G A T I O N    T H A T    O C C U R S    C A U S E S
    \n R I P P L E S     I N    O U R    A B S T R A C T I O N.    T H E S E    R I P P L E S
    \n C A R R Y    T H E    S O U N D S    O F    M I L L I O N S:    T H E I R    S T E P S,
    \n T H E I R    J O Y S,    T H E I R    F E A R S.
    \n \n Y O U    W I L L    E X P L O R E    S O M E    O F    T H E S E    S O U N D S.`, {
      align: 'center',
      size: 150,
      lineSpacing: 20,
      font: 'Lato',
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
      font: 'Lato',
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
    sprite.in(1000)
    step3TextDesc1.in(2000)
    Step3ContinueButton.in()
  })

  const eventViewHelperText = new TextGeometry(
    `C H O O S E     A     C O U N T R Y     T O     S T A R T     E X P L O R I N G`, {
      align: 'center',
      size: 150,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: 0,
        y: -100,
        z: 0,
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

  const SyriaEvent = new EventParticles('../public/objects/SyriaObj.json', {
    x: 0,
    y: 50,
    z: 50,
    scale: 0.09
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

  // PEURTO RICO EVENT

  const PeurtoRicoEvent = new EventParticles('../public/objects/PeurtoRicoObj.json', {
    x: -60,
    y: 50,
    z: 30,
    scale: 0.21
  })
  pondScene.add(PeurtoRicoEvent.getElement())

  const PeurtoRicoEventTitle = new TextGeometry(
    'P U E R T O    R I C O', {
      align: 'center',
      size: 200,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: PeurtoRicoEvent.getElement().position.x,
        y: PeurtoRicoEvent.getElement().position.y + 150,
        z: PeurtoRicoEvent.getElement().position.z,
      },
    },
  )

  pondScene.add(PeurtoRicoEventTitle.text)

  // ETHIOPIA EVENT

  const EthiopiaEvent = new EventParticles('../public/objects/EthiopiaObj.json', {
    x: 60,
    y: 50,
    z: 30,
    scale: 0.06
  })
  pondScene.add(EthiopiaEvent.getElement())

  const EthiopiaEventTitle = new TextGeometry(
    'E T H I O P I A', {
      align: 'center',
      size: 200,
      lineSpacing: 20,
      font: 'Lato',
      style: 'Normal',
      color: '#cbcbcb',
      position: {
        x: EthiopiaEvent.getElement().position.x,
        y: EthiopiaEvent.getElement().position.y + 150,
        z: EthiopiaEvent.getElement().position.z,
      },
    },
  )

  pondScene.add(EthiopiaEventTitle.text)

  Step3ContinueButton.text.cursor = 'pointer'
  Step3ContinueButton.text.on('click', () => {
    sprite.out()
    step3TextDesc1.out()
    Step3ContinueButton.out()

    // Event in
    eventViewHelperText.in()
    SyriaEvent.in()
    PeurtoRicoEvent.in()
    EthiopiaEvent.in()
  })

  SyriaEvent.getElement().cursor = 'pointer'
  SyriaEvent.getElement().on('mouseover', () => {
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
    RootComponent.switchScreen('pondScene', 'syriaEvent')
  })

  PeurtoRicoEvent.getElement().cursor = 'pointer'
  PeurtoRicoEvent.getElement().on('mouseover', () => {
    PeurtoRicoEvent.hoverIn()
    PeurtoRicoEventTitle.in(500)
  })
  PeurtoRicoEvent.getElement().on('mouseout', () => {
    PeurtoRicoEvent.hoverOut()
    PeurtoRicoEventTitle.out(500)
  })

  PeurtoRicoEvent.getElement().on('click', () => {
    PeurtoRicoEvent.hoverOut()
    PeurtoRicoEventTitle.out(500)
    RootComponent.switchScreen('pondScene', 'peurtoRicoEvent')
  })

  EthiopiaEvent.getElement().cursor = 'pointer'
  EthiopiaEvent.getElement().on('mouseover', () => {
    EthiopiaEvent.hoverIn()
    EthiopiaEventTitle.in(500)
  })
  EthiopiaEvent.getElement().on('mouseout', () => {
    EthiopiaEvent.hoverOut()
    EthiopiaEventTitle.out(500)
  })

  EthiopiaEvent.getElement().on('click', () => {
    EthiopiaEvent.hoverOut()
    EthiopiaEventTitle.out(500)
    RootComponent.switchScreen('pondScene', 'ethiopiaEvent')
  })

  /*
   *
   *
   * END Events
   *
   *
   * */

  /*
   * Light Params
   * */
  const spotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.penumbra = 1 // how soft the spotlight looks
  spotLight.position.set(0, 300, 200)
  spotLight.visible = false
  pondScene.add(spotLight)

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
    count: 20000,
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
  terrainMesh.position.set(0, -150, -700)
  pondScene.add(terrainMesh)

  pondScene.onIn(() => {
    if (!RootComponent.backToEvent) {
      step1TextDesc1.in(3000)
      step1TextTitle.in(2000)
      Step1ContinueButton.in(5000)
    } else {
      SyriaEvent.in()
      PeurtoRicoEvent.in()
      EthiopiaEvent.in()

      eventViewHelperText.in()
    }
    pondAudio.playAudio()
    backgroundParticles.in()
  })

  pondScene.onOut(() => {
    pondAudio.stopAudio()
    step1TextDesc1.out()
    step1TextTitle.out()
    Step1ContinueButton.out()
    SyriaEvent.out()
    PeurtoRicoEvent.out()
    EthiopiaEvent.out()
    eventViewHelperText.out()
    backgroundParticles.out()
  })

  pondScene.onStart(() => {
    backgroundParticles.getElement().visible = true
    sky.visible = true
    terrainMesh.visible = true
    spotLight.visible = true
  })

  pondScene.onStop(() => {
    backgroundParticles.getElement().visible = false
    sky.visible = false
    terrainMesh.visible = false
    spotLight.visible = false
  })

  pondScene.onUpdate(() => {
    sky.rotation.z += 0.001
    uniforms.time.value += 0.05
    SyriaEvent.updateCameraPosition(RootComponent.getCamera().position)
    PeurtoRicoEvent.updateCameraPosition(RootComponent.getCamera().position)
    EthiopiaEvent.updateCameraPosition(RootComponent.getCamera().position)
    backgroundParticles.animateParticles()
  })

  return pondScene
}
