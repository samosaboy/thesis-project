import * as React from 'react'
import * as styles from './Ripple.css'


export namespace Ripple {
  export interface Props {
    ripples: any,
    importance: number,
    rippleActive: (ripple: rippleActiveData) => void,
    addHelper: (helper: ContextualHelperData) => void,
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
    this.props.addHelper({ text: 'Click the ripple to explore!' })
    this.props.rippleActive({ title: ripple.name, description: ripple.description })
  }

  private renderRipple = (): JSX.Element => {
    return this.props.ripples.map((ripple, index) => {
      const scale = (200 * (index + 1)) / this.props.importance
      const r = scale / 2

      return (
        <g key={ripple.name + ripple.id} className={styles.svgInner}>
          <circle
            cx={100}
            cy={100}
            r={r}
            stroke={'black'}
            strokeWidth={2}
            style={{ animationDuration: (1.5 / (index + 1) + this.props.importance) + 's' }}
          />
          <circle
            cx={100}
            cy={100}
            r={r}
            stroke={'grey'}
            strokeWidth={30}
            className={styles.hiddenCircle}
            onMouseOver={() => this.rippleHover(ripple)}
            onMouseOut={() => {
              this.props.rippleActive({ title: '', description: '' })
              this.props.addHelper({ text: 'Use your mouse to scroll around' })
            }}
          />
        </g>
      )
    })
  }

  render() {
    return this.renderRipple()
  }
}

