import {
  type ChangeEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './InputSegment.module.css'

interface Props {
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  name?: string
  type?: string
  autoFocus?: boolean
  autoSelect?: boolean
  isValidInput?: boolean
  autoComplete?: boolean
  animate?: boolean
  placeholder?: string
  selectInputTrigger?: any
  className?: string
  style?: object
  containerClassName?: string
  labelClassName?: string
  containerStyles?: object
  required?: boolean
  maxLength?: number
  minLength?: number
}

/**
 * Component for each input+label section on the login page
 */
const InputSegment = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      value,
      onChange,
      type = 'text',
      name,
      autoFocus = false,
      autoSelect = false,
      isValidInput = true,
      autoComplete = true,
      animate = true,
      placeholder,
      selectInputTrigger = null,
      className = '',
      style = {},
      containerClassName,
      labelClassName,
      containerStyles = {},
      required = false,
      maxLength,
      minLength,
    },
    ref
  ) => {
    // transform the provided label into an id of format 'this-is-an-id'
    const id = label?.toLowerCase().replaceAll(' ', '-')

    // this state is used to mark the first time the user blurs from the input field
    const [initialEdit, setInitialEdit] = useState(!animate)

    const [initialRender, setInitialRender] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (autoSelect && inputRef.current) inputRef.current.select()
      setInitialRender(true)
    }, [autoSelect])

    useEffect(() => {
      if (selectInputTrigger != null && initialRender && inputRef.current)
        inputRef.current.select()
    }, [selectInputTrigger, initialRender])

    const handleLabelStyles = () => {
      let styles = ''
      if (initialEdit) {
        styles += 'opacity-100 '
        if (!isValidInput) styles += 'text-red-500'
      } else {
        if (value) styles += 'opacity-100 max-h-6'
        else styles += 'opacity-0 max-h-0'
      }
      return styles
    }

    return (
      <div
        className={`${styles.container} ${containerClassName}`}
        style={containerStyles}
      >
        <input
          name={name}
          type={type}
          id={id}
          ref={ref ?? inputRef}
          value={value}
          onChange={(e) => {
            setInitialEdit(true)
            onChange && onChange(e)
          }}
          className={`${
            styles.input
          } peer bg-white text-black dark:bg-zinc-600 dark:text-white ${className} ${
            value ? 'shadow-inner-lg brightness-100' : 'brightness-95'
          }`}
          style={style}
          placeholder={placeholder ?? label}
          autoFocus={autoFocus}
          autoComplete={autoComplete ? 'on' : 'off'}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
        />
        {label && (
          <label
            htmlFor={id}
            className={`${
              styles.label
            } text-slate-500 dark:text-neutral-400 ${handleLabelStyles()} ${labelClassName}`}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
InputSegment.displayName = 'InputSegment'
export default InputSegment
