import * as React from "react"
import { Header, Helper } from '../../components'

/* redux imports */
import * as helperActions from '../../actions/helper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { RouteComponentProps } from "react-router"

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof helperActions,
    helper: ContextualHelperData
  }

  export interface State {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {
  render() {
    const { helper, actions, children } = this.props
    return (
      <div>
        <Header addHelper={actions.addHelper}/>
        { children }
        <Helper helper={helper.text}/>
      </div>
    )
  }
}


function mapStateToProps(state: RootState) {
  return {
    helper: state.helper
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(helperActions as any, dispatch)
  }
}


