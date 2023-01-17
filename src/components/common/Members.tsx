import type { FC } from 'react'
import { RiGroupLine } from 'react-icons/ri'

interface Props {
  number: number
  showText?: boolean
  className?: string
}

const Members: FC<Props> = ({ number, className, showText = true }) => {
  return (
    <p
      className={`flex items-center gap-1 whitespace-nowrap text-slate-500 dark:text-neutral-400 ${className}`}
    >
      <RiGroupLine />
      {showText ? (
        <span>
          {number} member
          {number !== 1 && 's'}
        </span>
      ) : (
        <span>{number}</span>
      )}
    </p>
  )
}

export default Members
