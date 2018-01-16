import * as React from 'react'
import * as styles from './Helper.css'

interface Props {
  helper: string
}

export class Helper extends React.Component<Props, any> {
  render() {
    return <span className={styles.helperText}>{this.props.helper}</span>
  }
}
