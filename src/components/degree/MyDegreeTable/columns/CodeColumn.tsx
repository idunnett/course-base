import type { CellContext } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AiOutlineBarChart } from 'react-icons/ai'
import type { DegreeTableColumns } from '../types'

interface Props {
  info: CellContext<number | DegreeTableColumns, string | undefined>
}

const CodeColumn: React.FC<Props> = ({ info }) => {
  const [isHovering, setIsHovering] = useState(false)

  const color = useMemo(() => {
    if (typeof info.row.original === 'number') return null
    return info.row.original.color
  }, [info.row.original])
  const courseInfoId = useMemo(() => {
    if (typeof info.row.original === 'number') return null
    return info.row.original.courseInfoId
  }, [info.row.original])

  if (typeof info.row.original === 'number') return null
  return courseInfoId && color ? (
    <Link
      href={`/courses/${courseInfoId}`}
      className="flex w-min items-center gap-1 rounded-md px-2 hover:text-white "
      style={{
        backgroundColor: color + (isHovering ? 'ff' : '00'),
        color: isHovering ? 'white' : color,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AiOutlineBarChart
        className="h-4 w-4"
        style={{
          color: isHovering ? 'white' : color,
        }}
      />
      {info.getValue()}
    </Link>
  ) : (
    <span>{info.getValue()}</span>
  )
}
export default CodeColumn
