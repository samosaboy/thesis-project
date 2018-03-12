import * as React from 'react'
import {Shape} from 'react-konva'

interface Props {
  position: { x: number, y: number },
  text: { title: string }
}

export const Hover = (props: Props) => {
  const {position, text} = props

  if (text.title) {
    return (
      <Shape
        sceneFunc={context => {
          context.fillRect(0, 0, text.title.length * 9, 30)
          context.setAttr('font', '13pt Lora')
          context.setAttr('fillStyle', 'white')
          context.setAttr('zIndex', 999)
          context.fillText(`${text.title}`, 5, 20)
        }}
        x={position.x}
        y={position.y}
        width={50}
        fill={'#c3bfb9'}
        height={50}
      />
    )
  }
  return <Shape />
}
