import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { MdInsertChart } from 'react-icons/md'
import { RiBuilding2Line } from 'react-icons/ri'
import LoadingOrError from '../../../components/common/LoadingOrError'
import CourseDetailsForm from '../../../components/course/NewCourseForm/CourseDetailsForm'
import CourseSegmentsForm from '../../../components/course/NewCourseForm/CourseSegmentsForm'
import SegmentPieChart from '../../../components/diagrams/SegmentPieChart'
import { useMultiStepForm } from '../../../hooks/useMultiStepForm'
import type { CreateCourseVariationFormData } from '../../../types'
import { getTerm } from '../../../utils/termUtils'
import { trpc } from '../../../utils/trpc'

const INITIAL_DATA: CreateCourseVariationFormData = {
  year: '',
  term: '',
  instructor: '',
  segments: [],
  lat: null,
  lng: null,
  address: null,
}

const NewCourseVariation = () => {
  const router = useRouter()
  const [data, setData] = useState(INITIAL_DATA)

  const {
    data: courseInfo,
    isLoading,
    error,
  } = trpc.courseInfo.findById.useQuery(router.query.id as string, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!router.query.id,
  })

  const { currentStepIndex, steps, step, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <CourseDetailsForm
        {...data}
        color={courseInfo?.color}
        updateFields={updateFields}
        key={1}
      />,
      <CourseSegmentsForm {...data} updateFields={updateFields} key={2} />,
    ])

  const { mutate: createCourseVariation } =
    trpc.course.createVariation.useMutation({
      onSuccess: (res) => {
        router.push(`/my/courses/${res}`)
      },
      onError: (error) => {
        alert(error.message)
      },
    })

  function updateFields(fields: Partial<CreateCourseVariationFormData>) {
    setData((prev) => ({ ...prev, ...fields }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isLastStep) return next()

    if (!courseInfo?.id) return alert('Course info not found')

    const totalSegmentVal = data.segments
      .map((segment) => segment.value)
      .reduce((a, b) => a + b, 0)
    if (totalSegmentVal !== 100)
      return alert('The combined segment value is not 100%')

    const { segments } = data
    createCourseVariation({
      year: Number(data.year),
      term: getTerm(data.term),
      instructor: data.instructor,
      segments,
      infoId: courseInfo.id,
      location: {
        lat: data.lat,
        lng: data.lng,
        address: data.address,
      },
    })
  }

  if (!isLoading && courseInfo)
    return (
      <div className="relative flex w-full flex-col items-center justify-center gap-6 py-16">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex items-start gap-1">
            <MdInsertChart
              className="mt-1 text-2xl"
              style={{
                color: courseInfo.color,
              }}
            />
            <h2 className="text-xl font-bold text-slate-700 dark:text-white">
              {courseInfo?.code}
              <span className="font-medium text-slate-500 dark:text-neutral-400">
                : {courseInfo.name}
              </span>
            </h2>
          </div>
          <div
            className="flex w-min items-center gap-1 whitespace-nowrap rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
            style={{
              color: courseInfo.school.secondaryColor,
              backgroundColor: courseInfo.school.color,
            }}
          >
            <RiBuilding2Line />
            {courseInfo.school.name}
          </div>
        </div>
        <div className="flex w-full justify-evenly">
          <form
            className="relative w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5"
            onSubmit={handleSubmit}
          >
            {step}
            <div className="mt-4 flex items-center gap-2">
              {!isFirstStep && (
                <button type="button" className="secondary-btn" onClick={back}>
                  Back
                </button>
              )}
              <button type="submit" className="primary-btn">
                {isLastStep ? 'Submit' : 'Next'}
              </button>
              <div className="mx-2 text-sm text-slate-500">
                {currentStepIndex + 1} / {steps.length}
              </div>
            </div>
          </form>
          {currentStepIndex === 1 && (
            <div className="flex flex-col items-center justify-center gap-24 text-slate-700 dark:text-neutral-300">
              <h2
                className="text-4xl font-bold"
                style={{
                  color: courseInfo.color,
                }}
              >
                {courseInfo.name}
              </h2>
              <SegmentPieChart
                segments={data.segments.map((seg) => {
                  const dataEntry = {
                    ...seg,
                    color: courseInfo.color ?? '#64748b',
                    title: seg.name,
                  }
                  return dataEntry
                })}
              />
            </div>
          )}
        </div>
      </div>
    )
  return <LoadingOrError error={error?.message} />
}
export default NewCourseVariation
