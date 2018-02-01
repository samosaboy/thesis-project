import * as React from 'react'
import {Shape} from 'react-konva'

export default class Hover extends React.PureComponent<any, any> {
  private hoverItem: any

  public render() {
    return (
      <Shape
        ref={node => this.hoverItem = node}
        sceneFunc={context => {
          context.fillRect(0, 0, this.props.text.title.length * 9, 30)
          context.setAttr('font', '13pt Lora')
          context.setAttr('fillStyle', 'white')
          context.setAttr('zIndex', 999)
          context.fillText(`${this.props.text.title}`, 5, 20)
        }}
        x={this.props.position.x}
        y={this.props.position.y}
        width={50}
        fill={'#c3bfb9'}
        height={50}
      />
    )
    // return (
    //   <Shape
    //     sceneFunc={context => {
    //       context.setAttr('font', '13pt Lora')
    //       context.setAttr('fillStyle', 'black')
    //       context.fillText(`${this.props.position.x}, ${this.props.position.y}`, 0, 0)
    //     }}
    //     x={this.props.position.x}
    //     y={this.props.position.y}
    //     width={50}
    //     height={50}
    //     opacity={1}
    //     shadowEnabled={true}
    //   />
    // )
  }
}
