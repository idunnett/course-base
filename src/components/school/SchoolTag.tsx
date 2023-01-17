import type { School } from '@prisma/client'
import type { FC } from 'react'
import { RiBuilding2Line } from 'react-icons/ri'

interface Props {
  school: School
  className?: string
}

const SchoolTag: FC<Props> = ({ school, className }) => {
  return (
    <div
      className={`flex w-min items-center gap-1 whitespace-nowrap rounded-md p-1 text-xl font-medium ${className}`}
      style={{
        backgroundColor: school.color,
        color: school.secondaryColor,
      }}
    >
      <RiBuilding2Line />
      <span>{school.name}</span>
    </div>
  )
}

export default SchoolTag
