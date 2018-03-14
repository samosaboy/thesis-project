import * as React from 'react'
import {Circle} from 'react-konva'
import * as Konva from 'konva'
import * as actions from '../../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {createOscillation, createRotation, createStrokeGradient} from '../../../constants/helper'

export interface Props {
  ripple: any,
  radius: number,
  actions?: typeof actions,
}

export interface State {
  opacity: number,
  stroke: () => any,
}

export class Ripple<T extends Props> extends React.PureComponent<T & Props, State> {
  public animateRotation: any
  public animationOscillation: any
  public circle: any

  constructor(props) {
    super(props)
    this.state = {
      opacity: 0,
      stroke: createStrokeGradient(['#000000', '#494443'], null)
    }
  }

  componentDidMount() {
    // this.circle.getStage().setAttr('draggable', true)
    this.setZIndex(this.circle.parent.children)

    this.animateRotation = createRotation(this.circle)
    this.animationOscillation = createOscillation(this.circle, this.props.radius)
    this.animate()
  }

  public animate = (): void => {
    this.fadeAnimate()
    // this.animationOscillation.start()
  }

  componentWillUnmount() {
    this.props.actions.addHelper({text: null})
    this.props.actions.rippleActive({title: null})
    // this.circle.getStage().setAttr('draggable', false)
    this.animateRotation.stop()
    this.animationOscillation.stop()
  }

  public fadeAnimate = (): void => {
    this.circle.to({
      opacity: 1,
      duration: 1.5 * this.props.ripple.id,
      easing: Konva.Easings.EaseInOut,
    })
  }

  public createRippleEffect = (): void => {
    const group = this.circle.getStage().find('.eventGroup')[0].children
    const groupClone: any = [...group].reverse()

    groupClone[0].to({
      opacity: 1,
      scaleX: group.length / this.props.ripple.id,
      scaleY: group.length / this.props.ripple.id,
      duration: 1.5 * this.props.ripple.id,
      easing: Konva.Easings.EaseInOut,
    })

    setTimeout(() => {
      // delete groupClone[0]
      groupClone
        .forEach((item, index) => {
          item.to({
            opacity: 1,
            scaleX: group.length / (index),
            scaleY: group.length / (index),
            duration: 1.5 * this.props.ripple.id * 4,
          })
        })
    }, 1.5 * this.props.ripple.id * 1000)
  }

  public setZIndex = (array): void => {
    [...array]
      .sort((a, b): number => a.attrs.radius > b.attrs.radius ? 1 : -1)
      .forEach((ripple, index) => ripple.setZIndex(array.length - (index + 1)))
  }

  public rippleHover = (): void => {
    // this.animationOscillation.stop()
    this.animateRotation.start()
    this.circle.getStage().container().style.cursor = 'pointer'

    this.circle.setAttr('stroke', createStrokeGradient(['#e7b65c', '#c3246d'], this.circle))
    this.props.actions.addHelper({text: 'Click the ripple to explore!'})
    // this.props.actions.rippleActive({title: this.props.ripple.properties.title})
  }

  public resetHover = (): void => {
    this.animateRotation.stop()
    // this.animationOscillation.start()
    this.circle.getStage().container().style.cursor = 'default'

    this.circle.setAttr('stroke', createStrokeGradient(['#000000', '#494443'], this.circle))
    this.props.actions.addHelper({text: null})
    // this.props.actions.rippleActive({title: null})
  }

  public fillGradient = (): any => {
    return {
      fillRadialGradientStartRadius: 0.1,
      fillRadialGradientEndRadius: this.props.radius,
      fillRadialGradientColorStops: [0, '#bfbbb6', 1, '#E2DED8'],
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

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(Ripple)
