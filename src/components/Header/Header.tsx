import * as React from 'react'
import * as style from './Header.css'

export namespace Header {
  export interface Props {
    addHelper: (helper: ContextualHelperData) => void
  }

  export interface State {
    loading: boolean
    links: Array<{ name: string, url: string }>
  }
}

export class Header extends React.Component<Header.Props, Header.State> {
  constructor(props?: Header.Props, context?: any) {
    super(props, context)
    this.state = {
      loading: true,
      links: [
        {
          name: 'Home',
          url: '/',
        },
        {
          name: 'FAQ',
          url: '/faq',
        },
      ],
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }

  render() {
    return (
      <span>Nikunj Varshney Ⓒ 2018 <b>THIS IS A WIP</b></span>
    )
  }
  // render() {
  //   let links
  //   if (!this.state.loading) {
  //     links = <ul className={style.nav}>{
  //       this.state.links.map((link, index) => (
  //         <li key={index}><span key={index}>{link.name}</span></li>
  //       ))
  //     }</ul>
  //   } else {
  //     links = <span>Loading...</span>
  //   }
  //   return links
  // }
}
