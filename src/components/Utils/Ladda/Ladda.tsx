import * as React from 'react'
import {Circle, Group, Layer, Stage} from 'react-konva'
import * as Konva from 'konva'
import {createLaddaGradient} from '../../../constants/helper'

interface Props {
  isolated?: Boolean
}

export default class Ladda extends React.PureComponent<Props, null> {
  private ladda: any
  private laddaAnimate: any

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

    if (this.props.isolated) {
      return (
        <Stage
          draggable={false}
          style={{background: '#E2DED8'}}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer>
            <Group>
              <Circle
                ref={node => this.ladda = node}
                radius={100}
                x={window.innerWidth / 2}
                y={window.innerHeight / 2}
                stroke={stroke}
                strokeWidth={20}
              />
            </Group>
          </Layer>
        </Stage>
      )
    }
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
