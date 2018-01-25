import * as React from 'react'
import * as styles from './Canvas.css'
import Ripple from '../Ripple/Ripple'

export namespace Canvas {
  export interface Props {
    addHelper: (helper: ContextualHelperData) => void,
    rippleActive: (ripple: rippleActiveData) => void,
    rippleText: rippleActiveData
  }

  export interface State {
    data: any,
    props: any,
  }
}

export class Canvas extends React.Component<Canvas.Props, Canvas.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      props: {},
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
      <svg key={item.id} className={styles.svg} style={{left: item.position.left, top: item.position.top}}>
        <Ripple
          addHelper={this.props.addHelper}
          rippleActive={this.props.rippleActive}
          ripples={item.ripples}
          importance={item.importance}
        />
      </svg>
    ))
  }

  render() {
    if (!this.state.data.length) {
      return <span>Loading data</span>
    }
    return (
      <div>
        {this.renderItem()}
      </div>
    )
  }
}
