import * as THREE from 'three'
import * as BAS from 'three-bas'

export class AnimateFloor {
  constructor(props?: any) {
    const geometry = new BAS.ModelBufferGeometry(props)

    let i,
      j

    const aOffsetAmplitude = geometry.createAttribute('aOffsetAmplitude', 2)
    const positionBuffer = geometry.getAttribute('position').array
    let x,
      y,
      distance

    for (i = 0; i < aOffsetAmplitude.array.length; i += 12) { // 6 * 2
      const offset = THREE.Math.randFloat(1, 4)
      const amplitude = THREE.Math.randFloat(0.5, 2.0)

      x = 0
      y = 0

      // x/y position of the corresponding vertex from the position buffer
      for (j = 0; j < 6; j += 2) {
        x += positionBuffer[(i + j) / 2 * 3]
        y += positionBuffer[(i + j) / 2 * 3 + 1]
      }

      x /= 3
      y /= 3

      distance = Math.sqrt(x * x + y * y)

      for (j = 0; j < 12; j += 2) {
        aOffsetAmplitude.array[i + j] = (distance + offset) * (1.0 + THREE.Math.randFloatSpread(0.0125))
        aOffsetAmplitude.array[i + j + 1] = amplitude
      }
    }

    const aColor = geometry.createAttribute('color', 3)
    const color = new THREE.Color()

    for (i = 0; i < aColor.array.length; i += 18) { // 6 * 3
      color.setHSL(0, 0, THREE.Math.randFloat(0.5, 1.0));

      for (j = 0; j < 18; j += 3) {
        aColor.array[i + j]     = color.r;
        aColor.array[i + j + 1] = color.g;
        aColor.array[i + j + 2] = color.b;
      }
    }

    const material = new BAS.StandardAnimationMaterial({
      flatShading: true,
      vertexColors: THREE.VertexColors,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uD: { value: 4.4 },
        uA: { value: 3.2 },
      },
      uniformValues: {
        diffuse: new THREE.Color('#61637a'),
        roughness: 3,
        metalness: 6,
        opacity: 0.9,
      },
      vertexFunctions: [
        BAS.ShaderChunk['ease_cubic_in_out'],
      ],
      vertexParameters: [
        'uniform float uTime;',
        'uniform float uD;',
        'uniform float uA;',
        'attribute vec2 aOffsetAmplitude;',
      ],
      vertexPosition: [
        'float tProgress = sin(uTime + aOffsetAmplitude.x / uD);',
        'tProgress = easeCubicInOut(tProgress);',
        'transformed.z += aOffsetAmplitude.y * uA * tProgress;',
      ],
    })

    geometry.computeVertexNormals()

    // THREE.Mesh.call(this, geometry, material)
    return new THREE.Mesh(geometry, material)
  }
}
