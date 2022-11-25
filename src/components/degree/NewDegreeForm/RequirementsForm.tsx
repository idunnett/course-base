import { FC, useEffect, useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import Widget from '../../common/Widget'
import AutoComplete from '../../common/AutoComplete'
import CourseButton from '../../course/CourseButton'
import useDebounce from '../../../hooks/useDebounce'
import { CreateDegreeFormData, FullCourse, PartialCourse } from '../../../types'
import { trpc } from '../../../utils/trpc'
import Modal from '../../common/Modal'
import CourseDetails from '../../course/CourseDetails'
import InputSegment from '../../common/InputSegment'
import { HiOutlineClock } from 'react-icons/hi'

function isCourseType(obj: FullCourse | PartialCourse): obj is FullCourse {
  return !!(obj as FullCourse).id
}

interface Props {
  degreeYears: string
  creditHours: string
  requiredCourses: Array<FullCourse | PartialCourse>
  subjectRequirements: []
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const RequirementsForm: FC<Props> = ({
  degreeYears,
  creditHours,
  requiredCourses,
  subjectRequirements,
  updateFields,
}) => {
  const [codeInput, setCodeInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [creditHoursInput, setCreditHoursInput] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [showAddCourseInput, setShowAddCourseInput] = useState<number>(-1)
  const [currentTotalCreditHours, setCurrentTotalCreditHours] = useState(
    requiredCourses
      .map((c) =>
        typeof c.creditHours === 'string'
          ? parseFloat(c.creditHours)
          : c.creditHours
      )
      .reduce((a, b) => a + b, 0)
  )
  const [modalData, setModalData] = useState<FullCourse | null>(null)

  const debouncedSearchVal = useDebounce(searchVal)

  useEffect(() => setSearchVal(codeInput), [codeInput])
  useEffect(() => setSearchVal(nameInput), [nameInput])
  useEffect(() => {
    setCodeInput('')
    setNameInput('')
    setCreditHoursInput('')
    setCurrentTotalCreditHours(
      requiredCourses
        .map((c) =>
          typeof c.creditHours === 'string'
            ? parseFloat(c.creditHours)
            : c.creditHours
        )
        .reduce((a, b) => a + b, 0)
    )
  }, [requiredCourses])

  const { data, isError, isFetching } = trpc.course.search.useQuery(
    { searchVal: debouncedSearchVal },
    {
      queryKey: ['course.search', debouncedSearchVal],
      enabled: !!debouncedSearchVal,
      refetchOnWindowFocus: false,
    }
  )

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-1 text-3xl font-bold text-slate-500 dark:text-neutral-200">
        Create a Degree
      </h1>
      <div className="flex justify-between text-slate-500 dark:text-neutral-200">
        <h2 className="text-xl font-semibold">Course Requirements</h2>
        <div className="flex items-center gap-2 text-lg">
          <HiOutlineClock />
          <p>
            <span
              className={`${
                currentTotalCreditHours < parseFloat(creditHours) &&
                'text-red-300'
              }`}
            >
              {currentTotalCreditHours}
            </span>
            /{creditHours || 0}
          </p>
        </div>
      </div>
      {[...Array(Number(degreeYears))].map((_, year) => (
        <div key={year} className="flex flex-col gap-1">
          <h3 className="text-md text-slate-400 dark:text-neutral-300">
            Year {year + 1} required courses
          </h3>
          <Widget className="relative flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              {requiredCourses.map(
                (requiredCourse, index) =>
                  requiredCourse.degreeYear === year + 1 && (
                    <div
                      key={
                        isCourseType(requiredCourse)
                          ? requiredCourse.id
                          : requiredCourse.name + index
                      }
                      className="flex items-center"
                    >
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => {
                          setCodeInput('')
                          const updatedRequiredCourses = [...requiredCourses]
                          updatedRequiredCourses.splice(index, 1)
                          updateFields({
                            requiredCourses: updatedRequiredCourses,
                          })
                        }}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                      {isCourseType(requiredCourse) ? (
                        <CourseButton
                          course={requiredCourse}
                          onClick={() => setModalData(requiredCourse)}
                        />
                      ) : (
                        <div
                          key={
                            requiredCourse.code + requiredCourse.name + index
                          }
                          className="list-button flex flex-col items-start"
                        >
                          <div className="flex items-center">
                            <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
                              {requiredCourse.code}
                            </h2>
                            <p className="text-md text-base font-medium text-slate-500 dark:text-neutral-400">
                              : {requiredCourse.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 text-sm font-light text-slate-600 dark:text-neutral-400">
                            <HiOutlineClock />
                            <span>{requiredCourse.creditHours}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
            {showAddCourseInput === year ? (
              <div className="relative flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowAddCourseInput(-1)
                    setCodeInput('')
                  }}
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="relative flex items-center justify-between gap-2">
                  <AutoComplete
                    autoFocus
                    animate={false}
                    inputValue={codeInput}
                    setInputValue={setCodeInput}
                    containerClassName="!w-96 !static"
                    className="!text-lg"
                    label="Code"
                    suggestions={
                      !!searchVal && !!data?.items
                        ? data.items.filter(
                            ({ id, degreeYear, code, name }) =>
                              !requiredCourses
                                .map((rc) =>
                                  isCourseType(rc) ? rc.id : undefined
                                )
                                .includes(id) &&
                              degreeYear === year + 1 &&
                              (code
                                .toLowerCase()
                                .includes(searchVal.toLowerCase()) ||
                                name
                                  .toLowerCase()
                                  .includes(searchVal.toLowerCase()))
                          )
                        : []
                    }
                    isLoading={isFetching}
                    isError={isError}
                    onSuggestionItemSelect={(item) => {
                      const updatedRequiredCourses = [...requiredCourses]
                      updatedRequiredCourses.push(item)
                      updateFields({ requiredCourses: updatedRequiredCourses })
                      setShowAddCourseInput(-1)
                    }}
                    onEsc={() => {
                      setShowAddCourseInput(-1)
                      setCodeInput('')
                    }}
                    suggestionItemComponent={({
                      item: course,
                      index,
                      activeItemIndex,
                      onClick,
                    }) => (
                      <CourseButton
                        key={course.id}
                        course={course}
                        onClick={onClick}
                        className={
                          index === activeItemIndex ? 'active' : undefined
                        }
                      />
                    )}
                  />
                  <AutoComplete
                    animate={false}
                    inputValue={nameInput}
                    setInputValue={setNameInput}
                    containerClassName="w-full !static"
                    className="!text-lg"
                    label="Name"
                    suggestions={
                      !!searchVal && !!data?.items
                        ? data.items.filter(
                            ({ id, degreeYear, code, name }) =>
                              !requiredCourses
                                .map((rc) =>
                                  isCourseType(rc) ? rc.id : undefined
                                )
                                .includes(id) &&
                              degreeYear === year + 1 &&
                              (code
                                .toLowerCase()
                                .includes(searchVal.toLowerCase()) ||
                                name
                                  .toLowerCase()
                                  .includes(searchVal.toLowerCase()))
                          )
                        : []
                    }
                    isLoading={isFetching}
                    isError={isError}
                    onSuggestionItemSelect={(item) => {
                      const updatedRequiredCourses = [...requiredCourses]
                      updatedRequiredCourses.push(item)
                      updateFields({ requiredCourses: updatedRequiredCourses })
                      setShowAddCourseInput(-1)
                    }}
                    onEsc={() => {
                      setShowAddCourseInput(-1)
                      setCodeInput('')
                    }}
                    suggestionItemComponent={({
                      item: course,
                      index,
                      activeItemIndex,
                      onClick,
                    }) => (
                      <CourseButton
                        key={course.id}
                        course={course}
                        onClick={onClick}
                        className={
                          index === activeItemIndex ? 'active' : undefined
                        }
                      />
                    )}
                  />
                  <InputSegment
                    label="Credit Hours"
                    placeholder="3.5"
                    animate={false}
                    className="!text-lg"
                    containerClassName="!w-32 "
                    labelClassName="!w-16 text-xs flex items-end"
                    value={creditHoursInput}
                    onChange={(e) => setCreditHoursInput(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    if (!codeInput) return
                    const updatedRequiredCourses = [...requiredCourses]
                    updatedRequiredCourses.push({
                      code: codeInput,
                      name: nameInput,
                      creditHours: creditHoursInput,
                      degreeYear: year + 1,
                    })
                    updateFields({ requiredCourses: updatedRequiredCourses })
                    setShowAddCourseInput(-1)
                    setCodeInput('')
                  }}
                >
                  <FiCheck className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="relative flex w-full items-center justify-center">
                <button
                  type="button"
                  className="secondary-btn py-1.5 text-sm font-normal"
                  onClick={() => {
                    setCodeInput('')
                    setShowAddCourseInput(year)
                  }}
                >
                  Add Course
                </button>
              </div>
            )}
          </Widget>
        </div>
      ))}
      {modalData && (
        <Modal title="Course Details" handleClose={() => setModalData(null)}>
          <CourseDetails course={modalData} />
        </Modal>
      )}
    </div>
  )
}

export default RequirementsForm
