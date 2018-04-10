import * as React from 'react'
import * as THREE from 'three'

import * as SyriaShape from '../../public/Extrude.json'

const TWEEN = require('@tweenjs/tween.js')

export class EventParticles {
  private group: any

  constructor(params?: any) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      refractionRatio: 0.95,
    })

    this.group = new THREE.Object3D()
    const eventData = [
      {
        id: 1,
        location: {x: 0, y: 20, z: 100}
      },
    ]

    const geometry = new THREE.SphereGeometry(20, 16, 16)

    // for (let i = 0; i < eventData.length; i++) {
    //   const mesh = new THREE.Mesh(geometry, material)
    //   mesh.position.set(eventData[i].location.x, eventData[i].location.y, eventData[i].location.z)
    //   this.group.add(new THREE.Mesh(geometry, material))
    // }

    const loader = new THREE.JSONLoader()

    loader.load('../public/Extrude.json', obj => {
      const mesh = new THREE.Mesh(obj, new THREE.MeshStandardMaterial({
        color: 0xFFFFFF
      }))
      this.group.add(mesh)
    })

    // console.log(model)

    // console.log(this.group)
  }

  public getElement = () => this.group
}
