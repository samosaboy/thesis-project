import * as React from 'react'
import * as actions from '../../actions/actions'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RootState } from '../../reducers'

import TextLabel from '../../components/TextLabel'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export namespace Pond {
  export interface Props {
    scene: THREE.Scene,
    camera: THREE.Camera,
    clock: THREE.Clock,
    animate: Array<any>
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
class Pond extends React.PureComponent<Pond.Props, Pond.State> {
  private pondElement: any
  private title: any
  private subtitle: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
    }

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(20, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    )
    sphere.name = 'sphere'
    sphere.position.set(0, 0, 0)
    this.props.scene.add(sphere)

    this.props.scene.background = new THREE.Color('#111111')
    this.props.scene.fog = new THREE.FogExp2(0x595959, 0.0025 )

    this.title = new TextLabel({
      parent: sphere,
      camera: this.props.camera,
      text: 'The Ripple Effect',
      style: {
        font: 'Lato',
        weight: 600,
        size: 80,
        color: '#FFFFFF',
      },
    })

    this.title.start()

    this.props.animate.push(this.title.update)

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

  componentDidMount() {
    if (this.pondElement) {
      this.pondElement.appendChild(this.title.getElement())
    }
  }

  public render() {
    return (
      <div ref={node => this.pondElement = node}/>
    )
  }
}

export default withRouter(Pond)
