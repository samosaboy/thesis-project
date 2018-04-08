import * as React from 'react'
import * as actions from '../../actions/actions'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RootState } from '../../reducers'

import TextLabel from '../../components/TextLabel'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export namespace Test {
  export interface Props {
    actions?: typeof actions,
    scene: THREE.Scene,
    camera: THREE.Camera,
    clock: THREE.Clock,
    animate: Array<any>,
  }

  export interface State {
    data: any,
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

@connect(mapStateToProps, mapDispatchToProps)
class Test extends React.PureComponent<Test.Props, Test.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
    }

    /*
    * The main scene instantiated in index.tsx has children scenes
    * which are instantiated inside each child component
    *
    * Each child scene has groups with the name of the component
    * which we can use in our interaction from the main component
    *
    * THREE.Scene = [componentName]scene
    * THREE.Group = [componentName]group
    * */

    const pondScene = new THREE.Scene()
    const pondGroup = new THREE.Group()

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(50, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    )
    sphere.name = 'sphere'
    sphere.position.set(0, 0, 0)

    pondGroup.add(sphere)
    pondScene.add(pondGroup)

    pondScene.name = 'testScene'

    /* Add them to the parent scene */
    // this.props.scene.add(pondScene)
    this.props.scene.add(pondScene)

    // console.log(this.props.clock.getElapsedTime())

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

  public render() {
    return null
  }
}

export default withRouter(Test)
