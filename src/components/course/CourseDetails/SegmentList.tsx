import type { Dispatch, FC, SetStateAction } from 'react'
import type { FullCourse } from '../../../types'

interface Props {
  selectedCourse: FullCourse
  hoveredSegment: number | null
  setHoveredSegment: Dispatch<SetStateAction<number | null>>
}

const SegmentList: FC<Props> = ({
  selectedCourse,
  hoveredSegment,
  setHoveredSegment,
}) => {
  return (
    <div className="flex h-full items-start justify-center pt-8">
      <div className="h-full w-full overflow-y-auto px-8 py-4">
        <div className="flex h-auto flex-wrap justify-center gap-4">
          {selectedCourse.segments.map((segment, index) => (
            <div
              key={segment.name}
              className={`flex h-min max-w-min cursor-pointer gap-1 whitespace-nowrap rounded-md px-4 py-2 shadow-sm transition-all duration-200 ease-linear ${
                hoveredSegment === index
                  ? 'bg-gray-300 dark:bg-zinc-600'
                  : 'bg-gray-200 dark:bg-zinc-700'
              }`}
              onMouseOver={() => setHoveredSegment(index)}
              onMouseOut={() => setHoveredSegment(null)}
            >
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {segment.quantity}
              </span>
              <p className="text-lg font-medium text-slate-700 dark:text-neutral-300">
                {segment.name}{' '}
                <span className="text-sm text-slate-500 dark:text-neutral-400">
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
