import * as React from 'react'
import * as actions from '../../actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RootState } from '../../reducers'

import TextLabel from '../../components/TextLabel'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export namespace Pond {
  export interface Props {
    actions?: typeof actions,
    camera: THREE.Camera,
    clock: THREE.Clock,
    animateArray: Array<any>,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    mouseData: state.mouseData,
  }
}

class Pond extends React.PureComponent<Pond.Props, any> {
  constructor(props?: any, context?: any) {
    super(props, context)
    /*
     * The main scene instantiated in index.tsx has children scenes
     * which are instantiated inside each child component
     *
     * Each child scene has groups with the name of the component
     * which we can use in our interaction from the main component
     *
     * THREE.Scene = [componentName]scene
     * */

    const pondScene = new THREE.Scene()
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(60, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfff900 })
    )
    sphere.position.set(0, 0, 0)
    pondScene.add(sphere)

    pondScene.updateMatrixWorld()
    pondScene.name = 'pondScene'

    const light = new THREE.SpotLight(0xFFFFFF)
    light.position.set(0, 0, 150)

    pondScene.add(light)

    this.props.actions.addToSceneList({ scene: pondScene })

    // const title = new TextLabel({
    //   parent: sphere,
    //   camera: camera,
    //   text: 'The Ripple Effect',
    //   style: {
    //     font: 'Lato',
    //     weight: 600,
    //     size: 80,
    //     color: '#FFFFFF',
    //   },
    // })
    //
    // title.start()
    // animateArray.push(title.update)

    // So we discovered that we can actually add scenes!

    // To remove scenes:
    //scene.remove( mesh );
    // this.props.scene.remove(scene2)
    //
    // // clean up
    //
    // geometry.dispose();
    // material.dispose();
    // texture.dispose();
  }


  render() {
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pond)