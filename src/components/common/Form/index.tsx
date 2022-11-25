import type { FC, FormEvent, ReactNode } from 'react'
import styles from './Form.module.css'

interface Props {
  children: ReactNode
  title: string
  handleSubmit?: (e: FormEvent) => void
  className?: string
}

const Form: FC<Props> = ({
  children,
  title,
  handleSubmit = () => null,
  className,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} bg-white dark:bg-zinc-700 ${className}`}
    >
      {title && (
        <h1 className="text-slate-500 dark:text-neutral-200">{title}</h1>
      )}
      {children}
    </form>
  )
}

export default Form
