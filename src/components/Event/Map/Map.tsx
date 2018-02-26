import * as React from 'react'
import * as Paths from '../../../constants/paths'

interface Props {
  scene: any,
  city: string
}

const THREE = require('three')
const svgMesh3d = require('svg-mesh-3d')
const createGeometry = require('three-simplicial-complex')(THREE)


export const Map = (props: Props) => {
  // const {city, scene} = props
  const {scene} = props
  const city = 'Damascus'

  // Create Physical Map
  const meshData = svgMesh3d(Paths[city])
  const mapGeometry = createGeometry(meshData)
  const mapMaterial = new THREE.MeshBasicMaterial({
    color: '#b7b7b7',
    side: THREE.DoubleSide
  })
  const mapMesh = new THREE.Mesh(mapGeometry, mapMaterial)
  mapMesh.position.z = 2.55 //TODO: Not hardcode this

  // Create Bound Box for Camera Movements
  const box = new THREE.Box3()
  box.setFromObject(mapMesh)

  // Create Backdrop Map Outline
  const mapOutlineGeometry = mapGeometry
  const mapOutlineMaterial = new THREE.MeshBasicMaterial({
    color: '#d3d3d3',
    wireframe: true
  })
  const mapMeshOutline = new THREE.Mesh(mapOutlineGeometry, mapOutlineMaterial)
  mapMeshOutline.position.z = 2.54 //TODO: Not hardcode this
  mapOutlineGeometry.scale(1.8, 1.8, 1.8)

  if (scene) {
    scene.add(mapMesh)
    scene.add(mapMeshOutline)
    console.log(scene)
  }

  return null
}
