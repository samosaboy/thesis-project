import * as React from 'react'
import * as styles from './Hover.css'

const Hover = props => {

  const { text, position } = props

  return (
    <div style={{ left: position.x, top: position.y, position: 'absolute' }} className={styles.tooltip}>
      {position.x}, {position.y}
      <span className={styles.title}>{text.title}</span>
      {text.description}
    </div>
  )
}

export default Hover
