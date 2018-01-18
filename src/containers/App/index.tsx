import * as React from "react"
import { Canvas, Header, Helper } from '../../components'
import * as styles from './style.css'

/* redux imports */
import * as actions from '../../actions/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { RouteComponentProps } from "react-router"

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof actions,
    helper: ContextualHelperData,
    rippleActive: rippleActiveData
  }

  export interface State {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {
  render() {
    const { rippleActive, helper, actions, children } = this.props
    return (
      <div>
        <header className={styles.header}>
          <Header addHelper={actions.addHelper}/>
        </header>

        <Canvas rippleActive={actions.rippleActive} rippleText={rippleActive}/>
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
    helper: state.helper,
    rippleActive: state.rippleActive
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}


