import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import Ladda from '../../components/Utils/Ladda/Ladda'
import {Map} from "../../components"

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  data: any,
}

interface State {
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    data: state.eventActive
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class EventContainer extends React.Component<Props, State> {
  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouse: {x: 0, y: 0}
    }
  }

  componentDidMount() {
  }

  private renderRest = (): any => {
    const {geo} = this.props.data.data
    return (
      <Map
        city={geo.city}
      />
    )
  }

  public render() {
    return (
      <div>
        {this.renderRest()}
      </div>
    )
  }
}

export default withRouter(EventContainer)
