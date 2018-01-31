import * as React from 'react'
import {Props as PropBase, Ripple} from '../../components'
import {createStrokeGradient} from '../../constants/helper'
import * as Konva from 'konva'
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

interface Props extends PropBase {
  actions?: typeof actions,
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

@connect(null, mapDispatchToProps)
export class RippleEventView extends Ripple<Props> {
  constructor(props?: any) {
    super(props)
    this.state = {opacity: 1}
  }

  public rippleHover = (): void => {
    this.animateRotation.start()
    this.props.actions.eventRippleActive({
      title: 'test',
      description: 'test',
      map: 'test',
      visual: 'test',
    })
    this.circle.getStage().container().style.cursor = 'pointer'
    this.circle.setAttr('stroke', createStrokeGradient(['#e7b65c', '#c3246d'], this.circle))
    this.circle.to({
      strokeWidth: 30,
      duration: 0.5,
      easing: Konva.Easings.EaseIn(),
    })
  }

  public resetHover = (): void => {
    this.animateRotation.stop()
    this.circle.getStage().container().style.cursor = 'default'
    this.circle.setAttr('stroke', createStrokeGradient(['#000000', '#494443'], this.circle))
    this.circle.to({
      strokeWidth: 2,
      duration: 0.5,
      easing: Konva.Easings.EaseOut(),
    })
  }

  public fillGradient = (): any => {
    return {
      fill: false,
      opacity: 0,
    }
  }
}
