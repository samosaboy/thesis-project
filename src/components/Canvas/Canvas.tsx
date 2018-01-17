import * as React from 'react'
import * as styles from './Canvas.css'

export namespace Canvas {
  export interface State {
    data: any
  }
}

export class Canvas extends React.Component<any, Canvas.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    fetch('../../1.json')
      .then((res) => res.json())
      .then((data) => this.setState({ data }))
  }

  private rippleHover = (e): any => {
    console.log(e)
  }

  private renderRipple = (ripple: object, index: number): JSX.Element => {
    const key = index + 1
    const scale = 100 * key
    return (
      <circle
        cx={100}
        cy={100}
        r={scale/1.3}
        fill={'none'}
        stroke={'black'}
        strokeWidth={2}
        key={key}
        className={styles.circle}
        onMouseOver={() => this.rippleHover(ripple)}
      />
    )
  }

  private renderItem = (): JSX.Element => {
    return this.state.data.map((item) => (
      <div key={item.id}>
        <div>{item.geo.city}</div>
        <svg width={500} height={500} className={styles.svg}>
          {
            item.ripples.map((ripple, index) => this.renderRipple(ripple, index))
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
