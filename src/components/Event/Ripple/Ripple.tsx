import * as React from 'react'
import {Props as PropBase, Ripple} from '../../index'
import {Circle} from 'react-konva'
import {createOscillation, createRotation, createStrokeGradient} from '../../../constants/helper'
import * as Konva from 'konva'
import * as actions from '../../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

interface Props extends PropBase {
  actions?: typeof actions,
  audio: any
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
    this.state = {
      opacity: 1,
      stroke: createStrokeGradient(['#5783CE', '#52495D'], null)
    }
  }

  componentDidMount() {
    this.setZIndex(this.circle.parent.children)
    this.animateRotation = createRotation(this.circle)
    this.animationOscillation = createOscillation(this.circle, (this.props.radius * 0.1))
    this.animate()
  }

  public animate = (): void => {
    this.fadeAnimate()
    this.animationOscillation.start()
    this.animateRotation.start()
  }

  public rippleHover = (): void => {
    this.circle.getStage().container().style.cursor = 'pointer'
    this.circle.setAttr('stroke', createStrokeGradient(['#6A11CB', '#2575FC'], this.circle))
    this.circle.getLayer().children[0].setAttr('opacity', 1)
    this.circle.to({
      strokeWidth: 30,
      duration: 0.5,
      easing: Konva.Easings.EaseIn(),
    })
    this.props.actions.eventRippleActive({ripple: this.props.ripple})

    // pause the audio
    this.props.audio.pause()
  }

  public resetHover = (): void => {
    this.circle.getStage().container().style.cursor = 'default'
    this.circle.setAttr('stroke', createStrokeGradient(['#5783CE', '#52495D'], this.circle))
    this.circle.to({
      strokeWidth: 2,
      duration: 0.5,
      easing: Konva.Easings.EaseOut(),
    })
    this.props.actions.eventRippleActive({ripple: null})

    // resume the audio
    this.props.audio.play()
  }

  public fillGradient = (): any => {
    return {
      fill: false,
      opacity: 0,
    }
  }

  public render() {
    return (
      <Circle
        {...this.fillGradient()}
        ref={node => {
          this.circle = node
        }}
        x={100}
        y={100}
        radius={this.props.radius}
        stroke={this.state.stroke}
        strokeWidth={2}
        opacity={this.state.opacity}
        onMouseEnter={this.rippleHover}
        onMouseOut={this.resetHover}
        strokeScaleEnabled={true}
      />
    )
  }
}
