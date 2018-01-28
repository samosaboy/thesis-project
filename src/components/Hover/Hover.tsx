import * as React from 'react'
import {Shape} from 'react-konva'

export default class Hover extends React.PureComponent<any, any> {
  private hoverItem: any

  render() {
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
          fill={'black'}
        />
      )
    }
    return null
  }
}
// const Hover = props => {
//   const { children, text, position } = props
//
//   const rect = new Konva.Rect({
//     cornerRadius: 20,
//     x: position.x,
//     y: position.y,
//     width: 50,
//     height: 50,
//     fill: 'black',
//   })
//
//   return rect
//   // return (
//   //   <div style={{ left: position.x, top: position.y, position: 'absolute' }} className={styles.tooltip}>
//   //     {position.x}, {position.y}
//   //     <span className={styles.title}>{text.title}</span>
//   //     {text.description}
//   //   </div>
//   // )
// }
