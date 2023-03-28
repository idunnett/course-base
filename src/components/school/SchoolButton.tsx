import type { ButtonHTMLAttributes, FC } from 'react'
import Members from '../common/Members'
import SchoolTag from './SchoolTag'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  school: SchoolWithUserCount
  className?: string
}

const SchoolButton: FC<Props> = ({ school, onClick, className, ...props }) => {
  return (
    <button
      id="school-btn"
      type="button"
      onClick={onClick}
      className={`list-button items-end gap-2 p-2 text-sm font-light ${className}`}
      {...props}
    >
      <SchoolTag school={school} />
      <Members number={school._count.users} />
    </button>
  )
}
export default SchoolButton
