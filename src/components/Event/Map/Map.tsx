import * as React from 'react'
import * as Paths from '../../../constants/paths'

interface Props {
  city: string
}
export const Map = (props: Props) => {
  const {city} = props

  return <div>{city}</div>
}
