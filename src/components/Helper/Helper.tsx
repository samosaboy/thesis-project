import * as React from 'react'

export interface Props {
  helper: string
}

export class Helper extends React.Component<Props, any> {
  render() {
    return <span>{this.props.helper}</span>
  }
}
