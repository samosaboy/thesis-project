import * as React from 'react'
import * as styles from './Canvas.css'

import Ripple from '../Ripple/Ripple'

export namespace Canvas {
  export interface Props {
    rippleActive: (ripple: rippleActiveData) => void,
    rippleText: rippleActiveData
  }

  export interface State {
    data: any,
  }
}

export class Canvas extends React.Component<Canvas.Props, Canvas.State> {
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

  private renderActive = (): JSX.Element => {
    return <div>{this.props.rippleText.title}</div>
  }

  private renderItem = (): JSX.Element => {
    return (
      this.renderActive(),
      this.state.data.map((item) => (
      <div key={item.id}>
        <svg className={styles.svg} style={{left: item.position.left, top: item.position.top}}>
          <Ripple
            rippleActive={this.props.rippleActive}
            ripples={item.ripples}
            importance={item.importance}
          />
        </svg>
      </div>
    ))
    )
  }

  render() {
    if (!this.state.data.length) {
      return <span>Loading data</span>
    }
    return this.renderItem()
  }
}
