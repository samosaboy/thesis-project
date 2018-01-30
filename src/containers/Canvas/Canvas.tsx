import * as React from 'react'
import {Event} from '../../components'
import {Group, Text} from 'react-konva'
import * as Konva from 'konva'

export namespace Canvas {
  export interface Props {
    addHelper: (helper: ContextualHelperData) => void,
    rippleActive: (ripple: rippleActiveData) => void,
    rippleText: rippleActiveData
  }

  export interface State {
    data: any,
    props: any,
    loading: boolean,
  }
}

export class Canvas extends React.Component<Canvas.Props, Canvas.State> {
  private group: any
  private text: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      props: {},
      loading: true,
    }
  }

  componentDidMount() {
    fetch('../../1.json')
      .then(res => res.json())
      .then(data => {
        this.setState({data})
      })
      .then(() => {
        setTimeout(() => {
          this.setState({loading: false})
        }, 1500)
      })
  }

  private showEventInfo = (e?: any): any => {
    console.log(e.target.getAbsolutePosition())
  }

  private renderItem = (): JSX.Element => {
    return this.state.data.map(item => (
      <Group
        ref={node => this.group = node}
        x={item.position.left}
        y={item.position.top}
        key={item.id}
        onMouseOver={e => this.showEventInfo(e)}
      >
        <Text
          ref={node => this.text = node}
          align={'center'}
          text={item.geo.city}
          fontSize={24}
        />
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
    if (!this.state.loading) {
      return this.renderItem()
    }
    return <Text text={'Loading'} x={window.innerWidth / 2} y={window.innerHeight / 2}/>
  }
}
