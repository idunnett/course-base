import { FormEvent, useEffect, useState } from 'react'
import { useMultiStepForm } from '../../../hooks/useMultiStepForm'
import GeneralInfoForm from './GeneralInfoForm'
import RequirementsForm from './RequirementsForm'
import { CreateDegreeFormData } from '../../../types'
import { School } from '@prisma/client'

const INITIAL_DATA: CreateDegreeFormData = {
  name: '',
  school: null,
  degreeYears: '4',
  creditHours: '',
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
      <GeneralInfoForm {...data} updateFields={updateFields} />,
      <RequirementsForm {...data} updateFields={updateFields} />,
    ])

  function updateFields(fields: Partial<CreateDegreeFormData>) {
    setData((prev) => ({ ...prev, ...fields }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    next()
    console.log('submitted')
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
            {isLastStep ? 'Submit' : 'Next'}
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
