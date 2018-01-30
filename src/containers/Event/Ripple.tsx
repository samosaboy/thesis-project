import * as React from 'react'
import {Ripple} from '../../components'
import {createStrokeGradient} from '../../constants/helper'
import * as Konva from 'konva'

export class RippleEventView extends Ripple {
  constructor(props?: any) {
    super(props)
    this.state = { opacity: 1 }
    this.rippleHover = this.rippleHover.bind(this)
  }

  public rippleHover = (): void => {
    console.log(this.circle.getStage())
    this.animateRotation.start()
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
}
