import * as React from 'react'
import {Ripple} from '../../components'
import {createStrokeGradient} from '../../constants/helper'

export class RippleEventView extends Ripple {
  constructor(props?: any) {
    super(props)
    this.state = { opacity: 1 }
    this.rippleHover = this.rippleHover.bind(this)
  }

  public rippleHover = (): void => {
    console.log(this.props)
    this.animateRotation.start()
    this.circle.getStage().container().style.cursor = 'pointer'
    this.circle.setAttr('stroke', createStrokeGradient(['#e7b65c', '#c3246d'], this.circle))
  }

  public resetHover = (): void => {
    this.animateRotation.stop()
    this.circle.getStage().container().style.cursor = 'default'
    this.circle.setAttr('stroke', createStrokeGradient(['#000000', '#494443'], this.circle))
  }
}
