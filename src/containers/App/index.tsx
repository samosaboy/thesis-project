import * as React from "react"
import { Header, Helper } from '../../components'


export namespace App {
  export interface Props {
  }

  export interface State {
  }
}

export class App extends React.Component<App.Props, App.State> {
  render() {
    const { children } = this.props
    return (
      <div>
        <Header/>
        { children }
        <Helper/>
      </div>
    )
  }
}

