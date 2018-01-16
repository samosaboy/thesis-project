import * as React from 'react'

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

  private renderItem = (): JSX.Element => {
    return this.state.data.map((item) => {
      return item.ripples.map((ripple) => {
        const scale = 100 * ripple.scale
        return (
          <div key={ripple.scale}>
            <span>{item.geo.city}</span>
            <span>{ripple.name}</span>
            <span>{ripple.description}</span>
            <svg height={scale} width={scale}>
              <circle cx={scale/2} cy={scale/2} r={scale/2} stroke="black" />
            </svg>
          </div>
        )
      })
    })
  }

  render() {
    if (!this.state.data.length) {
      return <span>Loading data</span>
    }
    return this.renderItem()
  }
}
