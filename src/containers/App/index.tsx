import * as React from "react"
import { Canvas, Header, Helper } from '../../components'
import * as styles from './style.css'

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
        <header className={styles.header}>
          <Header addHelper={actions.addHelper}/>
        </header>

        <Canvas/>
        {children}
        <div className={styles.helper}>
          <Helper helper={helper.text}/>
        </div>
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


