import { type FC, useEffect } from 'react'
import ColorSelector from '../../common/ColorSelector'
import InputSegment from '../../common/InputSegment'
import Widget from '../../common/Widget'
import SchoolAutoComplete from '../../school/SchoolAutoComplete'
import type { School } from '@prisma/client'
import type { CreateCourseFormData } from '../../../types'

interface Props {
  name: string
  color: string
  degreeYear: string | undefined
  code: string
  credits: string
  school: School | null
  updateFields: (fields: Partial<CreateCourseFormData>) => void
}

const CourseInfoForm: FC<Props> = ({
  name,
  color,
  degreeYear,
  code,
  credits,
  school,
  updateFields,
}) => {
  useEffect(() => {
    if (degreeYear !== undefined) return
    const firstNumIndex = code.search(/[0-9]/)
    if (firstNumIndex !== -1) updateFields({ degreeYear: code[firstNumIndex] })
  }, [code, degreeYear])

  return (
    <Widget className="p-4">
      <h1 className="text-2xl font-bold text-slate-500 dark:text-neutral-200">
        Course Info
      </h1>
      <InputSegment
        value={name}
        onChange={(e) => updateFields({ name: e.target.value })}
        label="Course Name"
        autoComplete={false}
        autoSelect
        required
      />
      <div className="flex w-full gap-1">
        <InputSegment
          animate={false}
          value={code}
          onChange={(e) => updateFields({ code: e.target.value })}
          label="Course Code"
          placeholder="e.g. PSYCH101"
          autoComplete={false}
          required
        />
        <InputSegment
          animate={false}
          value={degreeYear ?? ''}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ degreeYear: e.target.value.replace(/\D/g, '') })
          }}
          label="Year of Degree"
          placeholder="e.g. 1 for 1st Year"
          autoComplete={false}
          required
          maxLength={1}
        />
        <InputSegment
          animate={false}
          value={credits}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ credits: e.target.value.replace(/\D/g, '') })
          }}
          label="Credits"
          placeholder="e.g. 3"
          autoComplete={false}
          required
          maxLength={1}
        />
      </div>
      <ColorSelector
        label="Course Color"
        value={color}
        setValue={(c) => updateFields({ color: c as string })}
      />
      <SchoolAutoComplete
        onInitialFetch={(school) => updateFields({ school })}
        onSelect={(school) => updateFields({ school })}
        school={school}
      />
    </Widget>
  )
}

export default CourseInfoForm
