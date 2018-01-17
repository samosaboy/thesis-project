import * as React from 'react'
import * as styles from './Canvas.css'

export namespace Canvas {
  export interface Ripple {
    name: string,
    description: string
  }

  // todo: figure out any => object
  export interface State {
    data: any,
    active: any
  }
}

export class Canvas extends React.Component<any, Canvas.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      active: {}
    }
  }

  componentDidMount() {
    fetch('../../1.json')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data })
      })
  }

  private rippleHover = (ripple: Canvas.Ripple): any => {
    this.setState({ active: ripple })
  }

  private renderRipple = (ripple: Canvas.Ripple, index: number): JSX.Element => {
    const key = index + 1
    const scale = 100 * key

    return (
      <svg key={key} className={styles.svgInner}>
        <circle
          cx={100}
          cy={100}
          r={scale/1.3}
          fill={'none'}
          stroke={'black'}
          strokeWidth={2}
          cursor={'pointer'}
        />
        <circle
          cx={100}
          cy={100}
          r={scale/1.3}
          fill={'none'}
          stroke={'grey'}
          strokeWidth={30}
          cursor={'pointer'}
          style={{ opacity: 0 }}
          onMouseOver={() => this.rippleHover(ripple)}
          onMouseOut={() => this.setState({ active: {} })}
        />
      </svg>
    )
  }

  private renderItem = (): JSX.Element => {
    return this.state.data.map((item) => (
      <div key={item.id}>
        <div>{item.geo.city}</div>
        <svg width={500} height={500} className={styles.svg} style={{ left: item.position.left, top: item.position.top}}>
          {
            item.ripples.map((ripple, index) => this.renderRipple(ripple, index))
          }
        </svg>
        <div>{this.state.active.name}</div>
        <div>{this.state.active.description}</div>
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
