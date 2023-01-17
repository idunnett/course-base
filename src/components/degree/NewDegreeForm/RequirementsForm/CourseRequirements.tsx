import { type FC, useEffect, useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import _ from 'lodash'
import useDebounce from '../../../../hooks/useDebounce'
import type {
  FullCourse,
  CreatePartialCourse,
  CreateDegreeFormData,
} from '../../../../types'
import { trpc } from '../../../../utils/trpc'
import AutoComplete from '../../../common/AutoComplete'
import InputSegment from '../../../common/InputSegment'
import Modal from '../../../common/Modal'
import Widget from '../../../common/Widget'
import CourseButton from '../../../course/CourseButton'
import CourseDetails from '../../../course/CourseDetails'
import { isFullCourseType } from '../../../../utils/courseUtils'
import CourseDegreeButton from '../../../course/CourseDegreeButton'
import { RiTimeLine } from 'react-icons/ri'

interface Props {
  degreeYears: string
  requiredCourses: Array<FullCourse | CreatePartialCourse>
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const CourseRequirements: FC<Props> = ({
  degreeYears,
  requiredCourses,
  updateFields,
}) => {
  const [searchVal, setSearchVal] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [creditsInput, setCreditsInput] = useState('1')
  const [showAddCourseInput, setShowAddCourseInput] = useState<number>(-1)
  const [modalData, setModalData] = useState<FullCourse | null>(null)

  const debouncedSearchVal = useDebounce(searchVal, 750)

  const { data, isError, isFetching } = trpc.course.search.useQuery(
    { searchVal: debouncedSearchVal },
    {
      queryKey: ['course.search', debouncedSearchVal],
      enabled: !!debouncedSearchVal,
      refetchOnWindowFocus: false,
    }
  )
  useEffect(() => setSearchVal(codeInput), [codeInput])
  useEffect(() => setSearchVal(nameInput), [nameInput])
  useEffect(() => {
    setCodeInput('')
    setNameInput('')
    setCreditsInput('1')
  }, [requiredCourses])
  return (
    <>
      {[...Array(Number(degreeYears))].map((_item, year) => (
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
                        isFullCourseType(requiredCourse)
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
                          const updatedRequiredCourses =
                            _.cloneDeep(requiredCourses)
                          updatedRequiredCourses.splice(index, 1)
                          updateFields({
                            requiredCourses: updatedRequiredCourses,
                          })
                        }}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                      {isFullCourseType(requiredCourse) ? (
                        <CourseDegreeButton
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
                            <RiTimeLine />
                            <span>{requiredCourse.credits}</span>
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
                                  isFullCourseType(rc) ? rc.id : undefined
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
                      const updatedRequiredCourses =
                        _.cloneDeep(requiredCourses)
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
                                  isFullCourseType(rc) ? rc.id : undefined
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
                      const updatedRequiredCourses =
                        _.cloneDeep(requiredCourses)
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
                    label="Credits"
                    placeholder="3"
                    animate={false}
                    className="!text-lg"
                    containerClassName="!w-32 "
                    labelClassName="!w-16 text-xs flex items-end"
                    value={creditsInput}
                    onChange={(e) => setCreditsInput(e.target.value)}
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
                      credits: creditsInput,
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
        <Modal handleClose={() => setModalData(null)}>
          <CourseDetails course={modalData} />
        </Modal>
      )}
    </>
  )
}

export default CourseRequirements
