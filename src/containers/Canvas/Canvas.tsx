import * as React from 'react'
import {Event} from '../../components'
import {Group} from 'react-konva'

export namespace Canvas {
  export interface Props {
    addHelper: (helper: ContextualHelperData) => void,
    rippleActive: (ripple: rippleActiveData) => void,
    rippleText: rippleActiveData
  }

  export interface State {
    data: any,
    props: any,
  }
}

export class Canvas extends React.Component<Canvas.Props, Canvas.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      props: {},
    }
  }

  componentDidMount() {
    fetch('../../1.json')
      .then(res => res.json())
      .then(data => {
        this.setState({ data })
      })
  }

  private renderItem = (): JSX.Element => {
    return this.state.data.map(item => (
      <Group
        x={item.position.left}
        y={item.position.top}
        key={item.id}
      >
        <Event
          addHelper={this.props.addHelper}
          rippleActive={this.props.rippleActive}
          ripples={item.ripples}
          importance={item.importance}
        />
      </Group>
    ))
  }

  render() {
    return this.renderItem()
  }
}
