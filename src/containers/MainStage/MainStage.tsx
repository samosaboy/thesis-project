import * as React from 'react'
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import Canvas from '../Canvas/Canvas'
import Hover from '../../components/Hover/Hover'
import {Group, Layer, Stage} from 'react-konva'
import {RootState} from '../../reducers'

export namespace MainStage {
  export interface Props {
    history: any,
    rippleActive: rippleActiveData,
    actions: typeof actions,
    position: pointerPositionData,
  }

  export interface State {
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    rippleActive: state.rippleActive,
    position: state.position,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class MainStage extends React.Component<MainStage.Props, MainStage.State> {
  private layer: any
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
      y: stageCursorPosition.y - stageShift.y(),
    }
    this.props.actions.positionSet(position)
  }

  public render() {
    const {history, position, rippleActive, actions} = this.props
    return (
      <Stage
        style={{background: '#E2DED8'}}
        ref={node => this.stage = node}
        draggable={true}
        onDragMove={() => this.getPointerPosition()}
        onDragStart={() => this.stage.getStage().container().style.cursor = 'move'}
        onDragEnd={() => this.stage.getStage().container().style.cursor = 'default'}
        onContentMouseMove={this.getPointerPosition}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer ref={node => this.layer = node}>
          <Canvas
            history={history}
            rippleActive={actions.rippleActive}
            rippleText={rippleActive}
            addHelper={actions.addHelper}
          />
          <Group>
            <Hover position={position} text={rippleActive}/>
          </Group>
        </Layer>
      </Stage>
    )
  }
}

export default withRouter(MainStage)
