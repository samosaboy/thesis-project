import * as React from 'react'
import Ripple from '../Ripple/Ripple'

interface Props {
  stats: any,
  importance: number,
}

export class Event extends React.PureComponent<Props, {}> {
  public render() {
    return this.props.stats.map((ripple, index) => {
      const scale = (200 * (index + 1)) / this.props.importance
      const r = scale / 2

      return (
        <Ripple
          key={ripple.id}
          ripple={ripple}
          radius={r}
        />
      )
    })
  }
}

