import * as React from 'react'
import * as styles from './Canvas.css'

import Ripple from '../Ripple/Ripple'

export namespace Canvas {
  export interface State {
    data: any,
  }
}

export class Canvas extends React.Component<any, Canvas.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    fetch('../../1.json')
      .then((res) => res.json())
      .then((data) => {
        this.setState({data})
      })
  }

  private renderItem = (): JSX.Element => {
    return this.state.data.map((item) => (
      <div key={item.id}>
        <div>{item.geo.city}</div>
        <svg className={styles.svg} style={{left: item.position.left, top: item.position.top}}>
          {
            item.ripples.map((ripple, index) =>
              <Ripple
                ripple={ripple}
                index={index}
                importance={item.importance}
              />
            )
          }
        </svg>
      </div>
    ))
  }

  render() {
    if (!this.state.data.length) {
      return <span>Loading data</span>
    }
    return this.renderItem()
  }
}
