import * as React from 'react'
import * as Konva from 'konva'
import {Circle} from 'react-konva'
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {createStrokeGradient} from '../../constants/helper'

export namespace Ripple {
  export interface Props {
    ripple: {
      name: string,
      id: number,
      description: string,
    },
    radius: number,
    actions?: typeof actions,
  }
}

class Ripple extends React.PureComponent<Ripple.Props, {}> {
  private circle: any

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setZIndex(this.circle.parent.children)
    this.fadeAnimate()
  }

  private fadeAnimate = (): void => {
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

  private rippleHover = (): void => {
    this.circle.parent.parent.parent.getStage().container().style.cursor = 'pointer'
    this.circle.to({
      scaleX: 1.01,
      scaleY: 1.01,
      easing: Konva.Easings.EaseInOut,
      duration: 0.2,
    })
    this.circle.setAttr('stroke', createStrokeGradient(['#e7b65c', '#c3246d'], this.circle))
    this.props.actions.addHelper({text: 'Click the ripple to explore!'})
    this.props.actions.rippleActive({title: this.props.ripple.name, description: this.props.ripple.description})
  }

  private resetHover = (): void => {
    this.circle.parent.parent.parent.getStage().container().style.cursor = 'default'
    this.circle.to({
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseInOut,
      duration: 0.5,
    })

    this.circle.setAttr('stroke', createStrokeGradient(['#000000', '#494443'], this.circle))
    this.props.actions.addHelper({text: null})
    this.props.actions.rippleActive({title: null, description: null})
  }

  render() {
    let stroke: any
    stroke = createStrokeGradient(['#000000', '#494443'], null)
    return (
      <Circle
        ref={node => {
          this.circle = node
        }}
        x={100}
        y={100}
        radius={this.props.radius}
        stroke={stroke}
        fillRadialGradientStartRadius={0.1}
        fillRadialGradientEndRadius={this.props.radius}
        fillRadialGradientColorStops={[0, '#bfbbb6', 1, '#E2DED8']}
        strokeWidth={2}
        opacity={0}
        onMouseEnter={this.rippleHover}
        onMouseOut={this.resetHover}
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
