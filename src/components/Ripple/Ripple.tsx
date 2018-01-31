import * as React from 'react'
import * as Konva from 'konva'
import {Circle} from 'react-konva'
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {createBreatheScale, createRotation, createStrokeGradient} from '../../constants/helper'

export interface Props {
  ripple: {
    name: string,
    id: number,
    description: string,
  },
  radius: number,
  actions?: typeof actions,
}

export interface State {
  opacity: number,
}

export class Ripple<T extends Props> extends React.PureComponent<T & Props, State> {
  public animateBreathe: any
  public animateRotation: any
  public circle: any

  constructor(props) {
    super(props)
    this.state = {opacity: 0}
  }

  componentDidMount() {
    this.circle.getStage().setAttr('draggable', true)
    this.setZIndex(this.circle.parent.children)
    this.fadeAnimate()
    this.animateRotation = createRotation(this.circle)
    this.animateBreathe = createBreatheScale(this.circle, 10 / this.props.radius, 1)

    setTimeout(() => {
      this.animateBreathe.start()
    }, 1000)
  }

  componentWillUnmount() {
    this.circle.getStage().setAttr('draggable', false)
    this.animateBreathe.stop()
    this.animateRotation.stop()
  }

  public fadeAnimate = (): void => {
    /*
    * To avoid memory leaks we use .to method to destroy the instance
    * once it is finished.
    * */
    this.circle.to({
      opacity: 1,
      duration: (Math.floor(Math.random() * 1.5) + 1) * this.props.ripple.id,
      easing: Konva.Easings.EaseInOut,
    })
  }

  private setZIndex = (array): void => {
    [...array]
      .sort((a, b): number => a.attrs.radius > b.attrs.radius ? 1 : -1)
      .forEach((ripple, index) => ripple.setZIndex(array.length - (index + 1)))
  }

  public rippleHover = (): void => {
    this.animateBreathe.stop()
    this.animateRotation.start()
    this.circle.getStage().container().style.cursor = 'pointer'

    this.circle.setAttr('stroke', createStrokeGradient(['#e7b65c', '#c3246d'], this.circle))
    this.props.actions.addHelper({text: 'Click the ripple to explore!'})
    this.props.actions.rippleActive({title: this.props.ripple.name, description: this.props.ripple.description})
  }

  public resetHover = (): void => {
    this.animateBreathe.start()
    this.animateRotation.stop()
    this.circle.getStage().container().style.cursor = 'default'

    this.circle.setAttr('stroke', createStrokeGradient(['#000000', '#494443'], this.circle))
    this.props.actions.addHelper({text: null})
    this.props.actions.rippleActive({title: null, description: null})
  }

  public fillGradient = (): any => {
    return {
      fillRadialGradientStartRadius: 0.1,
      fillRadialGradientEndRadius: this.props.radius,
      fillRadialGradientColorStops: [0, '#bfbbb6', 1, '#E2DED8'],
    }
  }

  public render() {
    let stroke: any
    stroke = createStrokeGradient(['#000000', '#494443'], null)

    return (
      <Circle
        {...this.fillGradient()}
        ref={node => {
          this.circle = node
        }}
        x={100}
        y={100}
        radius={this.props.radius}
        stroke={stroke}
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
