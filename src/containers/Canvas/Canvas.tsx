import * as React from 'react'
import * as actions from '../../actions/actions'
import {withRouter} from 'react-router'
import {data} from '../../../public/data.js'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

export namespace Canvas {
  export interface Props {
    actions?: typeof actions,
    history?: any,
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
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      props: {},
      loading: true,
      textPlacement: false,
    }
  }

  componentDidMount() {
    if (!this.state.data.length) {
      this.setState({data: data})
      this.setState({loading: false})
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
      <div key={item.id}>
        {item.importance}
      </div>
    ))
  }

  public render() {
    return this.renderItem()
  }
}

export default withRouter(Canvas)
