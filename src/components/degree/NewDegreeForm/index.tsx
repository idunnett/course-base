import { type FormEvent, useEffect, useState } from 'react'
import { useMultiStepForm } from '../../../hooks/useMultiStepForm'
import GeneralInfoForm from './GeneralInfoForm'
import RequirementsForm from './RequirementsForm'
import type {
  CreateDegreeFormData,
  FullCourse,
  CreatePartialCourse,
} from '../../../types'
import type { School } from '@prisma/client'
import { trpc } from '../../../utils/trpc'
import {
  DegreeModel,
  PartialCourseModel,
  SubjectRequirementModel,
} from '../../../../prisma/zod'
import type { z } from 'zod'
import { isCourseType } from '../../../utils/courseUtils'
import { FaSpinner } from 'react-icons/fa'

const INITIAL_DATA: CreateDegreeFormData = {
  name: '',
  school: null,
  degreeYears: '4',
  credits: '',
  admissionYear: '',
  requiredCourses: [],
  subjectRequirements: [],
}

const NewDegreeForm = ({ school }: { school: School | null }) => {
  useEffect(() => {
    updateFields({ school })
  }, [school])

  const [data, setData] = useState(INITIAL_DATA)
  const { currentStepIndex, steps, step, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <GeneralInfoForm {...data} updateFields={updateFields} key={1} />,
      <RequirementsForm {...data} updateFields={updateFields} key={2} />,
    ])

  const { mutate, isLoading } = trpc.degree.create.useMutation({
    onSuccess: (res) => {
      console.log(res)
      // router.push(`/degrees/${res}`)
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

    const CreateDegree = DegreeModel.omit({ id: true, memberCount: true })
    const CreateSubjectRequirements = SubjectRequirementModel.omit({
      id: true,
    }).array()
    const CreatePartialCourses = PartialCourseModel.omit({ id: true }).array()

    const fullCourses: FullCourse[] = []
    const partialCoursesData: CreatePartialCourse[] = []

    data.requiredCourses.forEach((c) => {
      if (isCourseType(c)) fullCourses.push(c)
      else partialCoursesData.push(c)
    })

    if (!data.school?.id) return alert('School must not be empty')

    const degree: z.infer<typeof CreateDegree> = {
      name: data.name,
      admissionYear: Number(data.admissionYear),
      years: Number(data.degreeYears),
      credits: parseFloat(data.credits),
      requiredCourseIds: fullCourses.map((fc) => fc.id),
      schoolId: data.school.id,
    }

    const subjectRequirements: z.infer<typeof CreateSubjectRequirements> =
      data.subjectRequirements.map((s) => ({
        ...s,
        year: Number(s.year),
        credits: parseFloat(s.credits),
      }))

    const partialCourses: z.infer<typeof CreatePartialCourses> =
      partialCoursesData.map((ps) => ({
        ...ps,
        degreeYear: Number(ps.degreeYear),
        credits: parseFloat(ps.credits),
      }))

    mutate({
      degree,
      subjectRequirements,
      partialCourses,
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
              <FaSpinner className="animate-spin" />
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
