import { type FormEvent, useEffect, useState } from 'react'
import CourseSegmentsForm from './CourseSegmentsForm'
import CourseInfoForm from './CourseInfoForm'
import { useMultiStepForm } from '../../../hooks/useMultiStepForm'
import { getTerm } from '../../../utils/termUtils'
import SegmentPieChart from '../../diagrams/SegmentPieChart'
import { useRouter } from 'next/router'
import type { CreateCourseFormData } from '../../../types'
import { trpc } from '../../../utils/trpc'
import type { School } from '@prisma/client'

const INITIAL_DATA: CreateCourseFormData = {
  name: '',
  color: '',
  year: '',
  term: '',
  instructor: '',
  code: '',
  school: null,
  degreeYear: undefined,
  credits: '',
  segments: [],
}

const NewCourseForm = ({ school }: { school: School | null }) => {
  const router = useRouter()

  useEffect(() => {
    updateFields({ school })
  }, [school])

  const [data, setData] = useState(INITIAL_DATA)
  const { currentStepIndex, steps, step, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <CourseInfoForm {...data} updateFields={updateFields} key={1} />,
      <CourseSegmentsForm {...data} updateFields={updateFields} key={2} />,
    ])

  const { mutate: createCourse } = trpc.course.create.useMutation({
    onSuccess: (res) => {
      router.push(`/my/courses/${res}`)
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  function updateFields(fields: Partial<CreateCourseFormData>) {
    setData((prev) => ({ ...prev, ...fields }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isLastStep) return next()

    const totalSegmentVal = data.segments
      .map((segment) => segment.value)
      .reduce((a, b) => a + b, 0)
    if (totalSegmentVal !== 100)
      return alert('The combined segment value is not 100%')

    if (!data.school) return alert('Please assign a school.')

    const { segments, ...courseData } = data
    const courseInfo = {
      code: courseData.code,
      name: courseData.name,
      color: courseData.color,
      degreeYear: Number(courseData.degreeYear),
      credits: Number(courseData.credits),
      schoolId: data.school.id,
    }
    const course = {
      year: Number(courseData.year),
      term: getTerm(courseData.term),
      instructor: courseData.instructor,
    }
    createCourse({ courseInfo, course, segments })
  }

  return (
    <div className="flex justify-evenly py-16">
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
              color: data.color,
            }}
          >
            {data.name}
          </h2>
          <SegmentPieChart
            segments={data.segments.map((seg) => {
              const dataEntry = {
                ...seg,
                color: data.color ?? '#64748b',
                title: seg.name,
              }
              return dataEntry
            })}
          />
        </div>
      )}
    </div>
  )
}

export default NewCourseForm
