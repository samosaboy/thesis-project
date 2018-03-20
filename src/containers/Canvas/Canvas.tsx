import * as React from 'react'
import {Group, Text} from 'react-konva'
import * as actions from '../../actions/actions'
import {Event} from '../../components'
import Ladda from '../../components/Utils/Ladda/Ladda'
import {withRouter} from 'react-router'
import {data} from '../../../public/data.js'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

export namespace Canvas {
  export interface Props {
    history: any,
    rippleText: rippleActiveData,
    actions?: typeof actions,
  }

  export interface State {
    data: any,
    props: any,
    loading: boolean,
    textPlacement: boolean,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

@connect(null, mapDispatchToProps)
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
          if (parent.getChildren()[0].attrs.x === item.properties.coordinates.x && parent.getChildren()[0].attrs.y === item.properties.coordinates.y) {
            item.clientRect = parent.getClientRect()
          }
        }
      })
    })
  }

  componentDidMount() {
    if (!this.state.data.length) {
      this.setState({data: data})
      setTimeout(() => {
        this.setState({loading: false})
        this.setClientRect()
        this.setState({textPlacement: true})
      }, 500)
    }
  }

  componentWillUnmount() {
    this.setState({loading: true})
  }

  private showEventInfo = (item: any): any => {
    this.props.actions.eventActive({data: item})
    this.props.history.push({
      pathname: `/${item.id}`,
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
          name={'eventGroup'}
          x={item.properties.coordinates.x}
          y={item.properties.coordinates.y}
        >
          <Event
            stats={item.stats}
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
            text={item.properties.title}
            name={item.properties.geo.map}
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
