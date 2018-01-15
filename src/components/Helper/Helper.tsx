import * as React from 'react'

/* redux imports */
import { connect } from 'react-redux'
import { RootState } from '../../reducers'

@connect(mapStateToProps, null)
export class Helper extends React.Component {
  render() {
    return <span>{this.props.helper.text}</span>
  }
}

function mapStateToProps(state: RootState) {
  return {
    helper: state.helper
  }
}
