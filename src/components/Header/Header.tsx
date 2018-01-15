import * as React from 'react'
import * as style from './Header.css'

/* redux imports */
import * as helperActions from '../../actions/helper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { RouteComponentProps } from "react-router"

export namespace Header {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof helperActions
  }

  export interface State {
    loading: boolean
    links: Array<{ name: string, url: string }>
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Header extends React.Component<any, Header.State> {
  constructor(props?: Header.Props, context?: any) {
    super(props, context)
    this.state = {
      loading: true,
      links: [
        {
          name: 'Home',
          url: '/'
        },
        {
          name: 'FAQ',
          url: '/faq'
        }
      ]
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
    setTimeout(() => {
      this.props.actions.addHelper({ text: 'This is a test' })
    }, 2000)
  }

  render() {
    let links
    if (!this.state.loading) {
      links = <ul className={style.nav}>{
        this.state.links.map((link, index) => (
          <li key={index}><span key={index}>{link.name}</span></li>
        ))
      }</ul>
    } else {
      links = <span>Loading...</span>
    }
    return links
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
