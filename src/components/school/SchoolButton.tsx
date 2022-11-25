import { School } from '@prisma/client'
import { FC, MouseEventHandler } from 'react'
import { BiBuildings } from 'react-icons/bi'
import { HiUsers } from 'react-icons/hi'

interface Props {
  school: School
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  className?: string
}

const SchoolButton: FC<Props> = ({
  school,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <button
      id="school-btn"
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`list-button items-end gap-2 p-2 ${className}`}
    >
      <div
        className="flex w-min items-center gap-1 whitespace-nowrap rounded-md p-1"
        style={{
          backgroundColor: school.color,
          color: school.secondaryColor,
        }}
      >
        <BiBuildings className="text-xl" />
        <span className="text-xl font-medium">{school.name}</span>
      </div>
      <p className="flex items-center gap-1 whitespace-nowrap text-sm font-light text-slate-500 dark:text-neutral-400">
        <HiUsers />
        <span>
          {school.memberCount} member
          {school.memberCount !== 1 && 's'}
        </span>
      </p>
    </button>
  )
}
export default SchoolButton
