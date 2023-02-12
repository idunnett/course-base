import { type FormEvent, useEffect, useState } from 'react'
import { useMultiStepForm } from '../../../hooks/useMultiStepForm'
import GeneralInfoForm from './GeneralInfoForm'
import RequirementsForm from './RequirementsForm'
import type {
  CourseInfoWithSchool,
  CreateDegreeFormData,
  CreatePartialCourse,
} from '../../../types'
import type { School } from '@prisma/client'
import { trpc } from '../../../utils/trpc'
import { isCourseInfoType } from '../../../utils/courseUtils'
import { RiLoader5Line } from 'react-icons/ri'
import { useRouter } from 'next/router'

const INITIAL_DATA: CreateDegreeFormData = {
  name: '',
  school: null,
  degreeYears: '4',
  credits: '',
  admissionYear: '',
  courseInfos: [],
  subjectRequirements: [],
}

const NewDegreeForm = ({ school }: { school: School | null }) => {
  const router = useRouter()
  useEffect(() => {
    updateFields({ school })
  }, [school])

  const [data, setData] = useState(INITIAL_DATA)
  const { currentStepIndex, steps, step, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <GeneralInfoForm {...data} updateFields={updateFields} key={1} />,
      <RequirementsForm {...data} updateFields={updateFields} key={2} />,
    ])

  const { mutate: createDegree, isLoading } = trpc.degree.create.useMutation({
    onSuccess: (res) => {
      router.push(`/degrees/${res}`)
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  function updateFields(fields: Partial<CreateDegreeFormData>) {
    setData((prev) => ({ ...prev, ...fields }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isLastStep) return next()

    const courseInfos: CourseInfoWithSchool[] = []
    const partialCourses: CreatePartialCourse[] = []

    data.courseInfos.forEach((c) => {
      if (isCourseInfoType(c)) courseInfos.push(c)
      else partialCourses.push(c)
    })

    if (!data.school?.id) return alert('School must not be empty')

    const subjectRequirements = data.subjectRequirements.map((s) => ({
      ...s,
      year: Number(s.year),
      credits: parseFloat(s.credits),
    }))

    createDegree({
      name: data.name,
      schoolId: data.school.id,
      credits: parseFloat(data.credits),
      admissionYear: Number(data.admissionYear),
      years: Number(data.degreeYears),
      courseInfoIds: courseInfos.map((c) => c.id),
      partialCourses: partialCourses.map((c) => ({
        ...c,
        credits: parseFloat(c.credits),
      })),
      subjectRequirements,
    })
  }

  return (
    <div className="flex justify-evenly py-16">
      <form
        className="relative z-10 w-11/12 md:w-4/5 lg:w-1/2"
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
            {isLoading ? (
              <RiLoader5Line className="animate-spin" />
            ) : isLastStep ? (
              'Submit'
            ) : (
              'Next'
            )}
          </button>
          <div className="mx-2 text-sm text-slate-500">
            {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewDegreeForm
