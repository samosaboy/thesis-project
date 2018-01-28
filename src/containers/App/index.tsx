import * as React from 'react'
import {Header} from '../../components'
import Helper from '../../components/Helper/Helper'
import {Canvas} from '../Canvas/Canvas'
import * as styles from './style.css'
import Hover from '../../components/Hover/Hover'
import {Group, Layer, Stage} from 'react-konva'
/* redux imports */
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {RootState} from '../../reducers'
import {RouteComponentProps} from 'react-router'

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof actions,
    helper: ContextualHelperData,
    rippleActive: rippleActiveData,
    position: pointerPositionData,
  }

  export interface State {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {
  private stage: any

  private getPointerPosition = (): void => {
    this.props.actions.positionSet({...this.stage.parent.getPointerPosition()})
  }

  render() {
    const {position, rippleActive, helper, actions, children} = this.props
    return (
      <main>
        <header className={styles.header}>
          <Header addHelper={actions.addHelper}/>
        </header>

        <Stage width={window.innerWidth} height={window.innerHeight} onContentMouseMove={this.getPointerPosition}>
          <Layer ref={node => this.stage = node}>
            <Canvas rippleActive={actions.rippleActive} rippleText={rippleActive} addHelper={actions.addHelper}/>
            <Group>
              <Hover position={position} text={rippleActive}/>
            </Group>
          </Layer>
        </Stage>

        {children}

        <footer className={styles.helper}>
          <Helper helper={helper.text}/>
        </footer>
      </main>
    )
  }
}


function mapStateToProps(state: RootState) {
  return {
    helper: state.helper,
    rippleActive: state.rippleActive,
    position: state.position,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}
