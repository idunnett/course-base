import type { Segment } from '@prisma/client'
import type { Dispatch, FC, SetStateAction } from 'react'
import type { FullCourse } from '../../../types'

interface Props {
  selectedCourse: Omit<FullCourse, 'segments'> & {
    segments?: Segment[]
  }
  hoveredSegment: number | null
  setHoveredSegment: Dispatch<SetStateAction<number | null>>
}

const SegmentList: FC<Props> = ({
  selectedCourse,
  hoveredSegment,
  setHoveredSegment,
}) => {
  return (
    <div className="flex h-full items-start justify-center">
      <div className="h-full w-full overflow-y-auto p-1">
        <div className="flex h-auto flex-wrap justify-start gap-2">
          {selectedCourse.segments?.map((segment, index) => (
            <div
              key={segment.name}
              className={`flex h-min max-w-min gap-1 whitespace-nowrap rounded-md px-2 py-1 shadow-sm transition-all duration-200 ease-linear ${
                hoveredSegment === index
                  ? 'bg-gray-200 dark:bg-zinc-600'
                  : 'bg-gray-100 dark:bg-zinc-700'
              }`}
              onMouseOver={() => setHoveredSegment(index)}
              onMouseOut={() => setHoveredSegment(null)}
            >
              <p className="text-base text-slate-600 dark:text-neutral-400">
                {segment.quantity} {segment.name}
                {' - '}
                <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">
                  {segment.value}%
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SegmentList
