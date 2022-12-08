import {
  type Dispatch,
  type FC,
  useState,
  type SetStateAction,
  useEffect,
} from 'react'
import _ from 'lodash'
import { FiCheck, FiX } from 'react-icons/fi'
import { MdRemoveCircle } from 'react-icons/md'
import type {
  CreateDegreeFormData,
  CreateSubjectRequirement,
} from '../../../../../types'
import AutoComplete from '../../../../common/AutoComplete'
import { subjects } from '../../../../../constants'
import InputSegment from '../../../../common/InputSegment'

interface Props {
  showAddSubject?: number
  subjectRequirements: CreateSubjectRequirement[]
  setShowAddSubject: Dispatch<SetStateAction<number | null>>
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const SubjectEditRow: FC<Props> = ({
  showAddSubject,
  subjectRequirements,
  setShowAddSubject,
  updateFields,
}) => {
  const [showSubjectInput, setShowSubjectInput] = useState(true)
  const [subjectInput, setSubjectInput] = useState('')
  const [subjectRequirement, setSubjectRequirement] =
    useState<CreateSubjectRequirement>({
      orHigher: true,
      subject: [],
      credits: '1',
      year: '',
    })

  useEffect(() => {
    if (showAddSubject != null && showAddSubject >= 0) {
      const sr = subjectRequirements[showAddSubject]
      if (sr) {
        setSubjectRequirement(sr)
        setShowSubjectInput(false)
      }
    }
  }, [])

  return (
    <div className="relative flex items-center justify-between gap-2">
      <button
        type="button"
        className="secondary-btn"
        onClick={() => {
          setShowAddSubject(null)
          setSubjectRequirement({
            orHigher: true,
            subject: [],
            credits: '1',
            year: '',
          })
        }}
      >
        <FiX className="h-5 w-5" />
      </button>
      <div className="relative flex w-full items-stretch justify-between gap-2">
        <div className="flex w-full flex-wrap items-center">
          {subjectRequirement.subject.map((subject, index) => (
            <p key={subject} className="flex items-center text-slate-400">
              <span className="relative whitespace-nowrap pr-1 text-slate-600 dark:text-neutral-300">
                {subject}
                <button
                  type="button"
                  className="absolute -top-2 -right-2"
                  onClick={() => {
                    setSubjectRequirement((prevVal) => {
                      const updatedVal = _.cloneDeep(prevVal)
                      updatedVal.subject.splice(index, 1)
                      return updatedVal
                    })
                  }}
                >
                  <MdRemoveCircle className="text-red-500" />
                </button>
              </span>
              {!!subjectRequirement.subject.length &&
              index !== subjectRequirement.subject.length - 1 ? (
                index === subjectRequirement.subject.length - 2 &&
                !showSubjectInput ? (
                  <span className="mx-1 font-light">or</span>
                ) : (
                  <span className="mr-1 font-light">,</span>
                )
              ) : null}
            </p>
          ))}
          {!subjectRequirement.subject.length || showSubjectInput ? (
            <div
              className={`ml-1 flex items-center gap-2 ${
                !subjectRequirement.subject.length && 'w-full'
              }`}
            >
              {!!subjectRequirement.subject.length && (
                <span className="text-slate-400">or</span>
              )}
              <AutoComplete<string>
                autoFocus
                placeholder="Subject"
                animate={false}
                label={
                  !subjectRequirement.subject.length ? 'Subject' : undefined
                }
                containerClassName="!w-full"
                className={
                  subjectRequirement.subject.length
                    ? '!rounded-md !px-3 !py-1.5 !text-base'
                    : '!text-lg'
                }
                inputValue={subjectInput}
                setInputValue={setSubjectInput}
                suggestions={Object.values(subjects).filter((subject) =>
                  subject
                    .toLocaleLowerCase()
                    .startsWith(subjectInput.toLocaleLowerCase())
                )}
                suggestionItemComponent={({
                  item: subject,
                  index,
                  activeItemIndex,
                  onClick,
                }) => (
                  <button
                    onClick={onClick}
                    className={`w-full rounded-md px-2 py-1 text-left text-slate-500 dark:text-neutral-400 ${
                      index === activeItemIndex && 'bg-gray-300'
                    }`}
                  >
                    {subject}
                  </button>
                )}
                onSuggestionItemSelect={(subject: string) => {
                  setSubjectRequirement((prevVal) => {
                    const updatedVal = _.cloneDeep(prevVal)
                    if (updatedVal.subject.includes(subject)) return updatedVal
                    updatedVal.subject.push(subject)
                    return updatedVal
                  })
                  setShowSubjectInput(false)
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSubjectInput(true)}
              className="secondary-btn px-2.5 py-1"
            >
              +
            </button>
          )}
        </div>
        <InputSegment
          label="Year"
          placeholder="1"
          animate={false}
          className="!text-lg"
          containerClassName="!w-32"
          value={subjectRequirement.year}
          onChange={(e) =>
            setSubjectRequirement((prevVal) => ({
              ...prevVal,
              year: e.target.value,
            }))
          }
        />
        <div className="my-1 flex flex-col">
          <label
            htmlFor="orAbove"
            className="h-6 whitespace-nowrap text-slate-500 dark:text-neutral-400"
          >
            Or above
          </label>
          <div className="flex h-full items-center justify-center">
            <input
              id="orAbove"
              type="checkbox"
              checked={subjectRequirement.orHigher}
              onChange={() =>
                setSubjectRequirement((prevVal) => {
                  const updatedVal = _.cloneDeep(prevVal)
                  updatedVal.orHigher = !updatedVal.orHigher
                  return updatedVal
                })
              }
              className="h-4 w-4 bg-white text-black dark:bg-zinc-600 dark:text-white"
            />
          </div>
        </div>
        <InputSegment
          label="Credits"
          placeholder="3"
          animate={false}
          className="!text-lg"
          containerClassName="!w-32"
          value={subjectRequirement.credits}
          onChange={(e) =>
            setSubjectRequirement((prevVal) => ({
              ...prevVal,
              credits: e.target.value,
            }))
          }
        />
      </div>
      <button
        type="button"
        className="secondary-btn"
        onClick={() => {
          if (
            !subjectRequirement.subject.length ||
            !subjectRequirement.credits ||
            !subjectRequirement.year
          )
            return
          const updatedSubjectRequirements = _.cloneDeep(subjectRequirements)
          if (showAddSubject != null && showAddSubject >= 0)
            updatedSubjectRequirements.splice(
              showAddSubject,
              1,
              subjectRequirement
            )
          else updatedSubjectRequirements.push(subjectRequirement)
          updateFields({
            subjectRequirements: updatedSubjectRequirements,
          })
          setShowAddSubject(null)
          setSubjectRequirement({
            orHigher: true,
            subject: [],
            credits: '1',
            year: '',
          })
        }}
      >
        <FiCheck className="h-5 w-5" />
      </button>
    </div>
  )
}

export default SubjectEditRow
