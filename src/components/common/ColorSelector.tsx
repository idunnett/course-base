import { Dispatch, FC, SetStateAction } from 'react'
import styles from './InputSegment/InputSegment.module.css'

const colors = {
  red: '#dc2626',
  orange: '#ea580c',
  amber: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
}

const lightColors = {
  red: '#f87171',
  orange: '#fb923c',
  yellow: '#facc15',
  lime: '#a3e635',
  green: '#4ade80',
  emerald: '#34d399',
  teal: '#2dd4bf',
  cyan: '#22d3ee',
  sky: '#38bdf8',
  blue: '#60a5fa',
  indigo: '#818cf8',
  violet: '#a78bfa',
  purple: '#c084fc',
  fuchsia: '#e879f9',
  pink: '#f472b6',
  rose: '#fb7185',
}

interface Props {
  label: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  lighter?: boolean
}

const ColorSelector: FC<Props> = ({
  label,
  value,
  setValue,
  lighter = false,
}) => {
  const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className={styles.container}>
      <div className="flex flex-wrap gap-2">
        {Object.entries(lighter ? lightColors : colors).map(([key, color]) => (
          <button
            key={key}
            type="button"
            onClick={() => setValue(color)}
            className={`group relative text-white border-2 rounded-xl h-7 w-7 transition-all duration-200 ease-linear ${
              color === value
                ? 'border-black dark:border-white scale-125'
                : 'border-transparent hover:scale-105'
            }`}
            style={{
              backgroundColor: color,
            }}
          >
            <span className="tooltip origin-bottom bottom-full left-1/2 -translate-x-1/2 mb-2">
              {capitalize(key)}
            </span>
          </button>
        ))}
      </div>
      {label && (
        <label
          className={`${styles.label} text-slate-500 dark:text-neutral-400`}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default ColorSelector
