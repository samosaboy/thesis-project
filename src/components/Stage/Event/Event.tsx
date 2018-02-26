import * as React from 'react'
import Ripple from '../Ripple/Ripple'

interface Props {
  ripples: any,
  importance: number,
  rippleActive: (ripple: rippleActiveData) => void,
  addHelper: (helper: helperData) => void,
}

export class Event extends React.PureComponent<Props, {}> {
  public render() {
    return this.props.ripples.map((ripple, index) => {
      const scale = (200 * (index + 1)) / this.props.importance
      const r = scale / 2

      return (
        <Ripple
          key={ripple.name + ripple.id}
          ripple={ripple}
          radius={r}
        />
      )
    })
  }
}
