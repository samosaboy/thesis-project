import * as React from 'react'
import * as actions from '../../actions/actions'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RootState } from '../../reducers'

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export namespace Canvas {
  export interface Props {
    actions?: typeof actions,
    scene: THREE.Scene,
    threeData?: any
  }

  export interface State {
    data: any,
    loading: boolean,
    lastHoveredEvent: any,
    mouseDown: boolean
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    threeData: state.threeData,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class Pond extends React.PureComponent<Canvas.Props, Canvas.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      loading: true,
      lastHoveredEvent: {},
      mouseDown: false,
    }

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
    return (
      <div>
        <span style={{
          position: 'absolute' as 'absolute',
          top: 50,
          width: window.innerWidth,
          textAlign: 'center',
          color: '#000000',
          zIndex: 10,
          opacity: this.state.mouseDown ? 0 : 1,
          transition: 'opacity 1.5s ease-in-out',
        }}>Click on an event and hold.</span>
        <span style={{
          position: 'absolute' as 'absolute',
          top: 150,
          width: window.innerWidth,
          textAlign: 'center',
          color: '#000000',
          zIndex: 10,
          opacity: this.state.mouseDown ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
        }}>Keep holding the button.</span>
      </div>

    )
  }
}

export default withRouter(Pond)
