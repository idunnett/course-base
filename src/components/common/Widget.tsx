import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: object
}

const Widget: FC<Props> = ({ children, className, style }) => {
  return (
    <div
      className={`rounded-2xl bg-white p-3 dark:bg-zinc-700 ${className}`}
      style={{
        boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default Widget
