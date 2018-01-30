import * as React from 'react'
import {Shape} from 'react-konva'

export default class Hover extends React.PureComponent<any, any> {
  private hoverItem: any

  public render() {
    if (this.props.text.title || this.props.text.description) {
      return (
        <Shape
          ref={node => this.hoverItem = node}
          sceneFunc={context => {
            context.setAttr('font', '13pt Lora')
            context.setAttr('fillStyle', 'black')
            context.fillText(`${this.props.text.title} / ${this.props.text.description}`, 0, 0)
          }}
          x={this.props.position.x}
          y={this.props.position.y}
          width={50}
          height={50}
          opacity={1}
          shadowEnabled={true}
        />
      )
    }
    //return null
    return (
      <Shape
        sceneFunc={context => {
          context.setAttr('font', '13pt Lora')
          context.setAttr('fillStyle', 'black')
          context.fillText(`${this.props.position.x}, ${this.props.position.y}`, 0, 0)
        }}
        x={this.props.position.x}
        y={this.props.position.y}
        width={50}
        height={50}
        opacity={1}
        shadowEnabled={true}
      />
    )
  }
}
