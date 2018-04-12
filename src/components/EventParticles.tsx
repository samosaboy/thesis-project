const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export class EventParticles {
  private sphereMesh: any
  private sphereMaterial: any
  private group: any
  private getCameraPosition: any
  private cache: any
  private countryMesh: any

  constructor() {
    this.cache = {
      y: 100,
      opacity: 0
    }

    this.sphereMaterial = new THREE.ShaderMaterial({
      uniforms:
        {
          'c': {
            type: 'f',
            value: 0.5,
          },
          'p': {
            type: 'f',
            value: 2.1,
          },
          glowColor: {
            type: 'c',
            value: new THREE.Color('#e0efff'),
          },
          viewVector: {
            type: 'v3',
            value: new THREE.Vector3(0, 0, 0),
          },
        },
      vertexShader: `uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      void main() 
      {
          vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( c - dot(vNormal, vNormel), p );
        
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      fragmentShader: `uniform vec3 glowColor;
      varying float intensity;
      void main() 
      {
        vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
      }`,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })

    this.sphereMaterial.needsUpdate = true

    this.group = new THREE.Group()
    this.group.visible = false
    const geometry = new THREE.SphereGeometry(22, 16, 16)

    const loader = new THREE.JSONLoader()

    loader.load('../public/objects/SyriaObj.json', obj => {
      this.countryMesh = new THREE.Mesh(obj, new THREE.MeshStandardMaterial({
        color: '#c2f3ff',
      }))
      obj.center()
      this.countryMesh.position.set(0, this.cache.y, 0)
      this.countryMesh.scale.multiplyScalar(0.09)
      this.countryMesh.name = 'event:Syria'
      this.group.add(this.countryMesh)

      this.sphereMesh = new THREE.Mesh(geometry.clone(), this.sphereMaterial)
      // this is always the position + the radius
      this.sphereMesh.position.set(0, this.cache.y, 0)
      this.sphereMesh.name = 'event:Syria'
      this.sphereMesh.clickable = true
      this.group.add(this.sphereMesh)
    })
  }

  public updateCameraPosition = (position) => {
    this.getCameraPosition = position
    this.sphereMaterial.uniforms.viewVector.value = new THREE.Vector3().addVectors(
      position,
      this.sphereMesh.position
    )
  }

  public in = () => {
    return new TWEEN.Tween(this.cache)
      .to({
        y: 80,
        opacity: 1,
      }, 2000)
      .easing(TWEEN.Easing.Circular.InOut)
      .onStart(() => {
        this.group.visible = true
      })
      .onUpdate(() => this.update())
      .start()
  }

  private update = () => {
    this.group.children.forEach(child => {
      child.position.y = this.cache.y
      child.material.opacity = this.cache.opacity
    })
  }

  public getElement = () => this.group

  public rotateElement = () => {
    this.countryMesh.rotation.y += 0.001
  }
}
