import * as React from 'react'
import * as styles from './Helper.css'

interface Props {
  helper: string
}

const Helper = (props: Props) => {
  const { helper } = props

  return <span className={styles.helperText}>{helper}</span>
}

export default Helper
