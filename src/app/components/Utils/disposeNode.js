export function disposeNode(parentObject) {
  parentObject.traverse(function(node) {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.dispose()
      }
      if (node.material) {
        var materialArray
        if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
          materialArray = node.material.materials
        } else if (node.material instanceof Array) {
          materialArray = node.material
        }
        if (materialArray) {
          materialArray.forEach(function(mtrl, idx) {
            if (mtrl.map) mtrl.map.dispose()
            if (mtrl.lightMap) mtrl.lightMap.dispose()
            if (mtrl.bumpMap) mtrl.bumpMap.dispose()
            if (mtrl.normalMap) mtrl.normalMap.dispose()
            if (mtrl.specularMap) mtrl.specularMap.dispose()
            if (mtrl.envMap) mtrl.envMap.dispose()
            mtrl.dispose()
          })
        } else {
          if (node.material.map) node.material.map.dispose()
          if (node.material.lightMap) node.material.lightMap.dispose()
          if (node.material.bumpMap) node.material.bumpMap.dispose()
          if (node.material.normalMap) node.material.normalMap.dispose()
          if (node.material.specularMap) node.material.specularMap.dispose()
          if (node.material.envMap) node.material.envMap.dispose()
          node.material.dispose()
        }
      }
    }
  })
}
