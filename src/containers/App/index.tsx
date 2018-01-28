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
    const stageCursorPosition = this.stage.getStage().getPointerPosition()
    const stageShift = this.stage.getStage()
    /*
    * We have to offset our cursorPosition with stage shift
    * to determine the new cursor position
    * */
    const position = {
      x: stageCursorPosition.x - stageShift.x(),
      y: stageCursorPosition.y - stageShift.y()
    }
    this.props.actions.positionSet(position)
  }

  componentDidMount() {
    console.log('no stage')
    if (this.stage) {
      console.log('this.stage')
    }
  }

  render() {
    const {position, rippleActive, helper, actions, children} = this.props
    return (
      <main>
        <header className={styles.header}>
          <Header addHelper={actions.addHelper}/>
        </header>

        <Stage
          ref={node => this.stage = node}
          draggable={true}
          onDragMove={() => this.getPointerPosition()}
          onDragStart={() => this.stage.getStage().container().style.cursor = 'move'}
          onDragEnd={() => this.stage.getStage().container().style.cursor = 'default'}
          onContentMouseMove={this.getPointerPosition}
          width={3000}
          height={3000}
        >
          <Layer>
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
