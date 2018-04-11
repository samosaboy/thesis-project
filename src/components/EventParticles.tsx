import * as React from 'react'
import * as THREE from 'three'

export class EventParticles {
  private sphereMesh: any
  private sphereMaterial: any
  private group: any
  private getCameraPosition: any

  constructor() {
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

    this.group = new THREE.Object3D()
    const eventData = [
      {
        id: 1,
        location: {
          x: 0,
          y: 20,
          z: 100,
        },
      },
    ]

    const geometry = new THREE.SphereGeometry(22, 16, 16)

    // for (let i = 0; i < eventData.length; i++) {
    //   const mesh = new THREE.Mesh(geometry, material)
    //   mesh.position.set(eventData[i].location.x, eventData[i].location.y, eventData[i].location.z)
    //   this.group.add(new THREE.Mesh(geometry, material))
    // }

    const loader = new THREE.JSONLoader()

    loader.load('../public/objects/SyriaObj.json', obj => {
      const mesh = new THREE.Mesh(obj, new THREE.MeshStandardMaterial({
        color: '#c2f3ff',
      }))
      obj.center()
      mesh.position.set(0, 60, 0)
      mesh.scale.multiplyScalar(0.09)
      mesh.name = 'event:Syria'
      this.group.add(mesh)

      this.sphereMesh = new THREE.Mesh(geometry.clone(), this.sphereMaterial)
      // this is always the position + the radius
      this.sphereMesh.position.set(0, 60, 0)
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

  public getElement = () => this.group
}
