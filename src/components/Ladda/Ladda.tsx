import * as React from 'react'
import {Circle} from 'react-konva'
import * as Konva from 'konva'
import {createLaddaGradient} from '../../constants/helper'


export default class Ladda extends React.PureComponent<any, any> {
  private ladda: any
  private laddaAnimate: any

  constructor(props?: any, context?: any) {
    super(props, context)
  }

  componentDidMount() {
    this.laddaAnimate = new Konva.Animation(() => {
      this.ladda.rotate(Math.PI)
    }, this.ladda.getLayer())

    this.laddaAnimate.start()
  }

  componentWillUnmount() {
    this.laddaAnimate.stop()
  }

  public render() {
    let stroke: any
    stroke = createLaddaGradient(this.ladda)

    return (
      <Circle
        ref={node => this.ladda = node}
        radius={100}
        x={window.innerWidth / 2}
        y={window.innerHeight / 2}
        stroke={stroke}
        strokeWidth={20}
      />
    )
  }
}
