import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  type Dispatch,
  type SetStateAction,
  type KeyboardEvent,
  type MouseEventHandler,
  type ForwardedRef,
  type FC,
  type Ref,
} from 'react'
import { RiLoader5Line } from 'react-icons/ri'
import styles from './AutoComplete.module.css'

interface SuggestionComponentProps {
  item: any
  index: number
  onClick: MouseEventHandler<HTMLButtonElement>
  activeItemIndex: number
}

interface Props<T> {
  label?: string
  animate?: boolean
  placeholder?: string
  inputValue: string
  setInputValue: Dispatch<SetStateAction<string>>
  suggestions: T[]
  autoFocus?: boolean
  isLoading?: boolean
  isError?: boolean
  containerClassName?: string
  className?: string
  onSuggestionItemSelect?: (suggestion: any) => void
  onEsc?: () => void
  suggestionItemComponent: FC<SuggestionComponentProps>
  required?: boolean
}

/**
 * Component for each input+label section on the login page
 */
function AutoCompleteInner<T>(
  {
    label,
    placeholder,
    inputValue,
    setInputValue,
    suggestions,
    animate = true,
    autoFocus = false,
    isLoading = false,
    isError = false,
    containerClassName,
    className,
    onSuggestionItemSelect,
    onEsc,
    suggestionItemComponent: ItemComponent,
    required = false,
  }: Props<T>,
  ref: ForwardedRef<HTMLInputElement>
) {
  // transform the provided label into an id of format 'this-is-an-id'
  const id = label?.toLowerCase().replaceAll(' ', '-')
  // this state is used to mark the first time the user blurs from the input field
  const [initialEdit, setInitialEdit] = useState(!animate)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    if (suggestions) {
      setActiveItemIndex(0)
    }
  }, [inputValue, suggestions])

  // This allows user to click on suggestions
  // but hide suggestions when clicked outside this component
  const handleClick = (e: MouseEvent) => {
    if (containerRef.current?.contains(e.target as HTMLElement)) return
    setShowSuggestions(false)
  }

  const handleLabelStyles = () => {
    let styles = ''
    if (initialEdit) {
      styles += 'opacity-100 '
    } else {
      if (inputValue) styles += 'opacity-100 max-h-6'
      else styles += 'opacity-0 max-h-0'
    }
    return styles
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // User pressed the enter key
    if (e.key === 'Enter') {
      if (!suggestions.length || !showSuggestions) return
      e.preventDefault()
      onSuggestionItemSelect &&
        onSuggestionItemSelect(suggestions[activeItemIndex])
      setInputValue('')
      setActiveItemIndex(0)
      setShowSuggestions(false)
    }
    // User pressed the up arrow
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (activeItemIndex === 0) return
      setActiveItemIndex(activeItemIndex - 1)
    }
    // User pressed the down arrow
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (activeItemIndex === suggestions.length - 1) return
      setActiveItemIndex(activeItemIndex + 1)
    }
    // User pressed the escape key
    else if (e.key === 'Escape' && onEsc) {
      e.preventDefault()
      onEsc()
    }
  }

  return (
    <div
      className={`${containerClassName} ${styles.container}`}
      ref={containerRef}
    >
      {isError ? (
        <div className="flex w-full justify-center p-0.5 text-sm text-red-500">
          <p>Error</p>
        </div>
      ) : (
        showSuggestions &&
        inputValue && (
          <>
            {isLoading && !suggestions?.length ? (
              <div
                className={`${styles.suggestions} flex items-center justify-center bg-gray-200 py-2 dark:bg-zinc-600`}
              >
                <RiLoader5Line className="ml-2 animate-spin dark:text-neutral-200" />
              </div>
            ) : (
              <ul
                className={`${styles.suggestions} bg-gray-200 dark:bg-zinc-600`}
              >
                {suggestions?.map((item, index) => (
                  <ItemComponent
                    key={index}
                    item={item}
                    index={index}
                    onClick={() => {
                      onSuggestionItemSelect &&
                        onSuggestionItemSelect(suggestions[index])
                      setInputValue('')
                    }}
                    activeItemIndex={activeItemIndex}
                  />
                ))}
              </ul>
            )}
          </>
        )
      )}
      <input
        type="text"
        id={id}
        ref={ref}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setInitialEdit(true)
          setShowSuggestions(true)
        }}
        onKeyDown={onKeyDown}
        onFocus={() => setShowSuggestions(true)}
        className={`${className} ${
          styles.input
        } peer bg-white text-black dark:bg-zinc-600 dark:text-white ${
          inputValue ? 'shadow-inner-lg brightness-100' : 'brightness-95'
        }`}
        placeholder={placeholder ?? label}
        autoComplete="off"
        autoFocus={autoFocus}
        required={required}
      />
      {label && (
        <label
          htmlFor={id}
          className={`${
            styles.label
          } text-slate-500 dark:text-neutral-400 ${handleLabelStyles()}`}
        >
          {label}
        </label>
      )}
    </div>
  )
}

const AutoCompleteWithRef = forwardRef(AutoCompleteInner)

type AutoCompleteWithRefProps<T> = Props<T> & {
  mRef?: Ref<HTMLInputElement>
}

function AutoComplete<T>({ mRef, ...props }: AutoCompleteWithRefProps<T>) {
  return <AutoCompleteWithRef ref={mRef} {...props} />
}

// forwardRef<HTMLInputElement, Props<I>>()
export default AutoComplete
