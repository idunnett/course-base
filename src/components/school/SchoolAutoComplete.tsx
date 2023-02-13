import type { School } from '@prisma/client'
import { useRouter } from 'next/router'
import { type FC, useEffect, useRef, useState } from 'react'
import useDebounce from '../../hooks/useDebounce'
import { trpc } from '../../utils/trpc'
import AutoComplete from '../common/AutoComplete'
import SchoolButton from './SchoolButton'

interface Props {
  school: SchoolWithUserCount | null
  animate?: boolean
  className?: string
  onSelect: (school: School) => void
  onInitialFetch?: (school: School) => void
  onShowInputField?: () => void
}

const SchoolAutoComplete: FC<Props> = ({
  school = null,
  animate = true,
  className,
  onInitialFetch,
  onSelect,
  onShowInputField,
}) => {
  const { id: initialId } = useRouter().query
  const autoCompleteRef = useRef<HTMLInputElement>(null)
  const [schoolSearchVal, setSchoolSearchVal] = useState('')
  const [showAddSchoolInput, setShowAddSchoolInput] = useState(false)

  const debouncedSchoolSearchVal = useDebounce(schoolSearchVal, 300)

  const { data, isError, isFetching } = trpc.school.search.useQuery(
    {
      searchVal: debouncedSchoolSearchVal,
    },
    {
      queryKey: ['school.search', debouncedSchoolSearchVal],
      enabled: !!debouncedSchoolSearchVal,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )

  trpc.school.findById.useQuery(initialId as string, {
    enabled: !!initialId && !!!school,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data && onInitialFetch) onInitialFetch(data)
    },
  })

  useEffect(() => {
    if (showAddSchoolInput) {
      autoCompleteRef.current?.focus()
      onShowInputField && onShowInputField()
    }
  }, [showAddSchoolInput])

  if (!showAddSchoolInput && school)
    return (
      <div className="flex flex-col">
        <label className="text-slate-500 dark:text-neutral-400">School</label>
        <SchoolButton
          school={school}
          onClick={() => setShowAddSchoolInput(true)}
        />
      </div>
    )

  return (
    <AutoComplete<School>
      animate={animate}
      className={className}
      mRef={autoCompleteRef}
      inputValue={schoolSearchVal}
      setInputValue={setSchoolSearchVal}
      label="School"
      suggestions={
        !!schoolSearchVal && data?.items
          ? data.items?.filter(({ name }) =>
              name.toLowerCase().includes(schoolSearchVal.toLowerCase())
            )
          : []
      }
      isLoading={isFetching}
      isError={isError}
      onSuggestionItemSelect={(item) => {
        onSelect(item)
        setShowAddSchoolInput(false)
        setSchoolSearchVal('')
      }}
      onEsc={() => {
        setShowAddSchoolInput(false)
        setSchoolSearchVal('')
      }}
      suggestionItemComponent={({
        item: school,
        index,
        activeItemIndex,
        onClick,
      }) => (
        <SchoolButton
          school={school}
          className={`${index === activeItemIndex && 'active'}`}
          onClick={onClick}
        />
      )}
      required
    />
  )
}

export default SchoolAutoComplete
