import * as React from 'react'
import {Group, Text} from 'react-konva'
import {Event} from '../../components/Event/Event'
import Ladda from '../../components/Ladda/Ladda'
import {withRouter} from 'react-router'

export namespace Canvas {
  export interface Props {
    history: any,
    addHelper: (helper: ContextualHelperData) => void,
    rippleActive: (ripple: rippleActiveData) => void,
    rippleText: rippleActiveData,
  }

  export interface State {
    data: any,
    props: any,
    loading: boolean,
    textPlacement: boolean,
  }
}

class Canvas extends React.PureComponent<Canvas.Props, Canvas.State> {
  private group: any
  private text: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      props: {},
      loading: true,
      textPlacement: false,
    }
  }

  private setClientRect = (): void => {
    this.state.data.forEach(item => {
      this.group.getStage().children[0].children.forEach(parent => {
        if (parent.getChildren().length) {
          if (parent.getChildren()[0].attrs.x === item.position.left && parent.getChildren()[0].attrs.y === item.position.top) {
            item.clientRect = parent.getClientRect()
          }
        }
      })
    })
  }

  componentDidMount() {
    if (!this.state.data.length) {
      fetch('../../1.json')
        .then(res => res.json())
        .then(data => {
          this.setState({data})
          setTimeout(() => {
            this.setState({loading: false})
            this.setClientRect()
            this.setState({textPlacement: true})
          }, 0)
        })
    }
  }

  componentWillUnmount() {
    this.setState({loading: true})
  }

  private showEventInfo = (item: any): any => {
    this.props.history.push({
      pathname: `/${item.id}`,
      state: {
        event: item,
      }
    })
  }

  private renderItem = (): JSX.Element => {
    return this.state.data.map(item => (
      <Group
        key={item.id}
        ref={node => this.group = node}
        onClick={() => this.showEventInfo(item)}
      >
        <Group
          x={item.position.left}
          y={item.position.top}
        >
          <Event
            addHelper={this.props.addHelper}
            rippleActive={this.props.rippleActive}
            ripples={item.ripples}
            importance={item.importance}
          />
        </Group>
        {
          this.state.textPlacement && <Text
            x={item.clientRect.x + (item.clientRect.width / 2)}
            y={item.clientRect.y + (item.clientRect.height / 2)}
            offset={{x: 75, y: -(item.clientRect.height / 1.5)}}
            fontFamily={'Lora'}
            align={'center'}
            width={150}
            ref={node => this.text = node}
            text={item.geo.city}
            name={item.geo.city}
            fontSize={18}
          />
        }
      </Group>
    ))
  }

  public render() {
    if (this.state.loading) {
      return <Ladda/>
    }
    return this.renderItem()
  }
}

export default withRouter(Canvas)
