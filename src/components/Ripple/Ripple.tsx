import * as React from 'react'
import * as styles from './Ripple.css'
import {Circle} from 'react-konva'

export namespace Ripple {
  export interface Props {
    ripples: any,
    importance: number,
    rippleActive: (ripple: rippleActiveData) => void,
    addHelper: (helper: ContextualHelperData) => void,
  }

  export interface State {
  }

  export interface RippleItem {
    name: string,
    description: string
  }
}

export default class Ripple extends React.PureComponent<Ripple.Props, Ripple.State> {
  private circle: any // Konva what do you return? why you do this??

  constructor(props?: any, context?: any) {
    super(props, context)
  }

  componentDidMount() {
    this.circle.cache()
    this.setZIndex(this.circle.parent.children)
  }

  private setZIndex = (array): void => {
    [...array]
      .sort((a, b): number => a.attrs.radius > b.attrs.radius ? 1 : -1)
      .forEach((ripple, index) => ripple.setZIndex(array.length - (index+1)))
  }

  private rippleHover = (ripple: Ripple.RippleItem): void => {
    this.props.addHelper({ text: 'Click the ripple to explore!' })
    this.props.rippleActive({ title: ripple.name, description: ripple.description })
  }

  private renderRipple = (): JSX.Element => {
    return this.props.ripples.map((ripple, index) => {
      const scale = (200 * (index + 1)) / this.props.importance
      const r = scale / 2

      return (
        <Circle
          ref={node => { this.circle = node }}
          key={ripple.name + ripple.id}
          x={100}
          y={100}
          radius={r}
          stroke={'black'}
          strokeWidth={2}
          onMouseOver={e => {
            e.target.scaleX(2)
            e.target.scaleY(2)
            e.target.cache()
            this.rippleHover(ripple)
          }}
        />
      )
    })
  }

  // <Circle
  //           ref={node => this.state.circle = node}
  //           x={100}
  //           y={100}
  //           radius={r}
  //           stroke={'grey'}
  //           strokeWidth={30}
  //           opacity={0}
  //           // className={styles.hiddenCircle}
  //           // onMouseOver={() => this.rippleHover(ripple)}
  //           // onMouseOut={() => {
  //           //   this.props.rippleActive({ title: '', description: '' })
  //           //   this.props.addHelper({ text: 'Use your mouse to scroll around' })
  //           // }}
  //         />

  render() {
    return this.renderRipple()
  }
}

