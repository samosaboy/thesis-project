import { createAnimation } from './Utils'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export class EventParticles {
  private sphereMesh: any
  private sphereMaterial: any
  private group: any
  private getCameraPosition: any
  private cache: any
  private countryMesh: any
  private createAnimation: any
  private position: THREE.Vector3

  constructor(position) {
    this.position = position
    this.sphereMaterial = new THREE.ShaderMaterial({
      uniforms:
        {
          'c': {
            type: 'f',
            value: 0.9,
          },
          'p': {
            type: 'f',
            value: 2.2,
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
    const geometry = new THREE.SphereGeometry(22, 48, 48)

    const loader = new THREE.JSONLoader()

    loader.load('../public/objects/SyriaObj.json', obj => {
      this.countryMesh = new THREE.Mesh(obj, new THREE.MeshStandardMaterial({
        color: '#f4ffee',
      }))
      obj.center()
      this.countryMesh.scale.multiplyScalar(0.09)
      this.group.add(this.countryMesh)

      this.sphereMesh = new THREE.Mesh(geometry.clone(), this.sphereMaterial)
      this.group.position.set(position.x, position.y, position.z)
      this.group.add(this.sphereMesh)
    })

    this.createAnimation = new createAnimation(this.group, {
      y: this.position.y < 0 / 2 ? -300 : 300,
      opacity: 0,
    })
  }

  public updateCameraPosition = (position) => {
    this.getCameraPosition = position
    if (this.sphereMesh) {
      this.sphereMaterial.uniforms.viewVector.value = new THREE.Vector3().addVectors(
        position,
        this.sphereMesh.position,
      )
    }
  }

  public in = (dur?: number) => {
    this.createAnimation.in({
      y: this.position.y,
      opacity: 1,
    }, dur || 2000)
  }

  public out = () => {
    this.createAnimation.out(1000)
  }

  public getElement = () => this.group

  public hoverIn = () => {
    new TWEEN.Tween(this.sphereMaterial.uniforms['c'])
      .to({ value: 1.6 }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
    new TWEEN.Tween(this.group.position)
      .to({ z: 100 }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
  }

  public hoverOut = () => {
    new TWEEN.Tween(this.sphereMaterial.uniforms['c'])
      .to({ value: 0.9 }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
    new TWEEN.Tween(this.group.position)
      .to(this.position, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
  }
}
