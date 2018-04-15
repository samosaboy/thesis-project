import * as Delaunay from './Utils/delaunay.js'
import { AnimateFloor } from './AnimatedFloor'

const THREE = require('three')

export class Floor {
  public mesh: any

  constructor() {
    let vertices = [],
      indices,
      i

    const Phi = Math.PI * (3 - Math.sqrt(5))
    const n = 500
    const radius = 200
    const noise = 4

    for (i = 0; i <= n; i++) {
      const t = i * Phi
      const r = Math.sqrt(i) / Math.sqrt(n)
      const x = r * Math.cos(t) * (radius - THREE.Math.randFloat(0, noise))
      const y = r * Math.sin(t) * (radius - THREE.Math.randFloatSpread(0, noise))

      vertices.push([x, y])
    }

    indices = Delaunay.triangulate(vertices)

    const pointsX = []
    const pointsY = []
    const segmentsX = 3
    const segmentsY = 3

    for (i = 0; i <= segmentsX; i++) {
      pointsX.push(new THREE.Vector3(
        THREE.Math.mapLinear(i, 0, segmentsX, -radius, radius),
        0,
        (i === 0 || i === segmentsX) ? 0 : -THREE.Math.randFloat(64, 72),
      ))
    }

    for (i = 0; i <= segmentsY; i++) {
      pointsY.push(new THREE.Vector3(
        0,
        THREE.Math.mapLinear(i, 0, segmentsY, -radius, radius),
        (i === 0 || i === segmentsY) ? 0 : -THREE.Math.randFloat(64, 72),
      ))
    }

    const splineX = new THREE.CatmullRomCurve3(pointsX)
    const splineY = new THREE.CatmullRomCurve3(pointsY)

    const geometry = new THREE.Geometry()
    const shapeScale = 1

    for (i = 0; i < indices.length; i += 3) {
      // build the face
      let v0 = vertices[indices[i]]
      let v1 = vertices[indices[i + 1]]
      let v2 = vertices[indices[i + 2]]

      // calculate centroid
      const cx = (v0[0] + v1[0] + v2[0]) / 3
      const cy = (v0[1] + v1[1] + v2[1]) / 3

      // translate, scale, un-translate
      v0 = [(v0[0] - cx) * shapeScale + cx, (v0[1] - cy) * shapeScale + cy]
      v1 = [(v1[0] - cx) * shapeScale + cx, (v1[1] - cy) * shapeScale + cy]
      v2 = [(v2[0] - cx) * shapeScale + cx, (v2[1] - cy) * shapeScale + cy]

      // draw the face to a shape
      const shape = new THREE.Shape()
      shape.moveTo(v0[0], v0[1])
      shape.lineTo(v1[0], v1[1])
      shape.lineTo(v2[0], v2[1])

      // use the shape to create a geometry
      const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
        amount: 1,
        bevelEnabled: false,
      })

      // offset z vector components based on the two splines
      for (let j = 0; j < shapeGeometry.vertices.length; j++) {
        const v = shapeGeometry.vertices[j]
        const ux = THREE.Math.clamp(THREE.Math.mapLinear(v.x, -radius, radius, 0.0, 1.0), 0.0, 1.0)
        const uy = THREE.Math.clamp(THREE.Math.mapLinear(v.y, -radius, radius, 0.0, 1.0), 0.0, 1.0)

        v.z += splineX.getPointAt(ux).z
        v.z += splineY.getPointAt(uy).z
      }

      // merge into the whole
      geometry.merge(shapeGeometry)
    }

    geometry.center()

    const floor: any = new AnimateFloor(geometry)
    this.mesh = floor
  }
}
