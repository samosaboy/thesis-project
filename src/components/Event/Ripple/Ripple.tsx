import * as React from 'react'
import {Props as PropBase, Ripple} from '../../index'
import {createStrokeGradient} from '../../../constants/helper'
import * as Konva from 'konva'
import * as actions from '../../../actions/actions'
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
export default class RippleEventView extends Ripple<Props> {
  constructor(props?: any) {
    super(props)
    this.state = {opacity: 1}
  }

  public animate = (): void => {
    // this.fadeAnimate()
  }

  public rippleHover = (): void => {
    this.animateRotation.start()
    this.circle.getStage().container().style.cursor = 'pointer'
    this.circle.setAttr('stroke', createStrokeGradient(['#c0b65b', '#d20400'], this.circle))
    this.circle.getLayer().children[0].setAttr('opacity', 1)
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