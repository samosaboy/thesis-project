import * as React from 'react'
import * as styles from './Ripple.css'

export namespace Ripple {
  export interface Props {
    ripples: any,
    importance: number,
    rippleActive: (ripple: rippleActiveData) => void
  }

  export interface RippleItem {
    name: string,
    description: string
  }
}

export default class Ripple extends React.PureComponent<Ripple.Props, any> {
  constructor(props?: any, context?: any) {
    super(props, context)
  }

  private rippleHover = (ripple: Ripple.RippleItem): any => {
    this.props.rippleActive({ title: ripple.name })
  }

  private renderRipple = (): JSX.Element => {
    return this.props.ripples.map((ripple, index) => {
      const scale = (200 * (index + 1)) / this.props.importance
      const r = scale / 2

      return (
        <svg key={index} className={styles.svgInner}>
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
            onMouseOver={() => this.rippleHover(ripple)}
            onMouseOut={() => this.props.rippleActive({ title: '', description: '' })}
          />
        </svg>
      )
    })
  }

  render() {
    return this.renderRipple()
  }
}
