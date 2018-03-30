import * as React from 'react'
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import Canvas from '../Canvas/Canvas'

/*
* This is the main stage of the app (index)
* */

export namespace MainStage {
  export interface Props {
    actions: typeof actions,
  }

  export interface State {
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}

@connect(null, mapDispatchToProps)
class MainStage extends React.Component<MainStage.Props, MainStage.State> {
  public render() {
    return (
      <Canvas />
    )
  }
}

export default withRouter(MainStage)
