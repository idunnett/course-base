import type { Dispatch, FC, SetStateAction } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import type { Data } from 'react-minimal-pie-chart/types/commonTypes'

interface Props {
  segments: Data
  hoveredSegment?: number | null
  setHoveredSegment?: Dispatch<SetStateAction<number | null>>
}

const SegmentPieChart: FC<Props> = ({
  segments,
  hoveredSegment = null,
  setHoveredSegment = null,
}) => {
  return (
    <PieChart
      data={segments}
      animate
      animationDuration={200}
      animationEasing="linear"
      segmentsStyle={(index) => ({
        transition: 'filter 200ms linear',
        cursor: 'pointer',
        transformOrigin: 'center',
        filter:
          hoveredSegment != null && index !== hoveredSegment
            ? 'grayscale(1)'
            : 'grayscale(0)',
      })}
      startAngle={180}
      lineWidth={20}
      paddingAngle={18}
      rounded
      label={({ dataEntry }) => dataEntry.value + '% - ' + dataEntry.title}
      labelStyle={(_index) => ({
        fontSize: '0.325em',
        fill: 'currentcolor',
      })}
      labelPosition={110}
      totalValue={100}
      onMouseOver={(_, index) => setHoveredSegment && setHoveredSegment(index)}
      onMouseOut={() => setHoveredSegment && setHoveredSegment(null)}
      style={{
        height: 220,
        width: 220,
        overflow: 'visible',
      }}
      className="text-slate-500 dark:text-neutral-400"
    />
  )
}

export default SegmentPieChart
