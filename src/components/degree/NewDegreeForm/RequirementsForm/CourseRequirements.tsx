import { type FC, useEffect, useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import _ from 'lodash'
import useDebounce from '../../../../hooks/useDebounce'
import type {
  CreatePartialCourse,
  CreateDegreeFormData,
  CourseInfoWithSchool,
} from '../../../../types'
import { trpc } from '../../../../utils/trpc'
import AutoComplete from '../../../common/AutoComplete'
import InputSegment from '../../../common/InputSegment'
import Modal from '../../../common/Modal'
import Widget from '../../../common/Widget'
import CourseButton from '../../../course/CourseButton'
import CourseDetails from '../../../course/CourseDetails'
import { isCourseInfoType } from '../../../../utils/courseUtils'
import CourseDegreeButton from '../../../course/CourseDegreeButton'
import { RiTimeLine } from 'react-icons/ri'
import CourseModal from '../../../course/CourseModal'

interface Props {
  degreeYears: string
  courseInfos: Array<CourseInfoWithSchool | CreatePartialCourse>
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const CourseRequirements: FC<Props> = ({
  degreeYears,
  courseInfos,
  updateFields,
}) => {
  const [searchVal, setSearchVal] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [creditsInput, setCreditsInput] = useState('1')
  const [showAddCourseInput, setShowAddCourseInput] = useState<number>(-1)
  const [modalData, setModalData] = useState<CourseInfoWithSchool | null>(null)

  const debouncedSearchVal = useDebounce(searchVal, 750)

  const { data, isError, isFetching } = trpc.courseInfo.search.useQuery(
    { searchVal: debouncedSearchVal },
    {
      queryKey: ['courseInfo.search', debouncedSearchVal],
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
  }, [courseInfos])
  return (
    <>
      {[...Array(Number(degreeYears))].map((_item, year) => (
        <div key={year} className="flex flex-col gap-1">
          <h3 className="text-md text-slate-400 dark:text-neutral-300">
            Year {year + 1} required courses
          </h3>
          <Widget className="relative flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              {courseInfos.map(
                (courseInfo, index) =>
                  courseInfo.degreeYear === year + 1 && (
                    <div
                      key={
                        isCourseInfoType(courseInfo)
                          ? courseInfo.id
                          : courseInfo.name + index
                      }
                      className="flex items-center"
                    >
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => {
                          setCodeInput('')
                          const updatedRequiredCourses =
                            _.cloneDeep(courseInfos)
                          updatedRequiredCourses.splice(index, 1)
                          updateFields({
                            courseInfos: updatedRequiredCourses,
                          })
                        }}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                      {isCourseInfoType(courseInfo) ? (
                        <CourseDegreeButton
                          courseInfo={courseInfo}
                          onClick={() => setModalData(courseInfo)}
                        />
                      ) : (
                        <div
                          key={courseInfo.code + courseInfo.name + index}
                          className="list-button flex flex-col items-start"
                        >
                          <div className="flex items-center">
                            <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
                              {courseInfo.code}
                            </h2>
                            <p className="text-md text-base font-medium text-slate-500 dark:text-neutral-400">
                              : {courseInfo.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 text-sm font-light text-slate-600 dark:text-neutral-400">
                            <RiTimeLine />
                            <span>{courseInfo.credits}</span>
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
                              !courseInfos
                                .map((rc) =>
                                  isCourseInfoType(rc) ? rc.id : undefined
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
                      const updatedRequiredCourses = _.cloneDeep(courseInfos)
                      updatedRequiredCourses.push(item)
                      updateFields({ courseInfos: updatedRequiredCourses })
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
                              !courseInfos
                                .map((rc) =>
                                  isCourseInfoType(rc) ? rc.id : undefined
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
                      const updatedRequiredCourses = _.cloneDeep(courseInfos)
                      updatedRequiredCourses.push(item)
                      updateFields({ courseInfos: updatedRequiredCourses })
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
                    const updatedRequiredCourses = [...courseInfos]
                    updatedRequiredCourses.push({
                      code: codeInput,
                      name: nameInput,
                      credits: creditsInput,
                      degreeYear: year + 1,
                    })
                    updateFields({ courseInfos: updatedRequiredCourses })
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
        <CourseModal
          courseInfo={modalData}
          handleClose={() => setModalData(null)}
        />
      )}
    </>
  )
}

export default CourseRequirements
