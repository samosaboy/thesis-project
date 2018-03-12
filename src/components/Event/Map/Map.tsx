import * as React from 'react'
import * as d3 from 'd3'
import * as Paths from '../../../constants/paths'

interface Props {
  map: string
}
let ref: SVGSVGElement
export const Map = (props: Props) => {
  const {map} = props

  d3.select(ref)
    .append('path')
    .attr("d", Paths[map])
    .attr('fill', '#e4e4e4')
    .attr('stroke', '#dadada')
    .attr('stroke-width', 1)

  return (
    <svg
      ref={(refs: SVGSVGElement) => ref = refs}
      viewBox={`0, 0, ${window.innerWidth}, ${window.innerHeight}`}
      preserveAspectRatio={'xMaxYMax meet'}
    />
  )
}
