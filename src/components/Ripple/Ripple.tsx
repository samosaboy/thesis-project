import * as React from 'react'
import * as styles from './Ripple.css'

export namespace Ripple {
  export interface Props {
    ripple: RippleItem,
    index: number,
    importance: number
  }

  export interface State {
    active: any
  }

  export interface RippleItem {
    name: string,
    description: string
  }
}

export default class Ripple extends React.PureComponent<Ripple.Props, Ripple.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      active: {}
    }
  }

  componentDidMount() {
    console.log(this.props)
  }

  private rippleHover = (ripple: Ripple.RippleItem): any => {
    this.setState({active: ripple})
    console.log(this.state.active)
  }

  private renderRipple = (): JSX.Element => {
    const key = this.props.index + 1
    const scale = (200 * key) / this.props.importance
    const r = scale / 2

    return (
      <svg key={this.props.index} className={styles.svgInner}>
        <circle
          cx={100}
          cy={100}
          r={r}
          fill={'none'}
          stroke={'black'}
          strokeWidth={2}
          cursor={'pointer'}
        />
        <circle
          cx={100}
          cy={100}
          r={r}
          fill={'none'}
          stroke={'grey'}
          strokeWidth={30}
          cursor={'pointer'}
          style={{opacity: 0}}
          onMouseOver={() => this.rippleHover(this.props.ripple)}
          onMouseOut={() => this.setState({active: {}})}
        />
      </svg>
    )
  }

  render() {
    return this.renderRipple()
  }
}
