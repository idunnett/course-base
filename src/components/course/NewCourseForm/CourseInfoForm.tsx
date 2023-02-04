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
  year: string
  degreeYear: string | undefined
  term: string
  instructor: string
  code: string
  credits: string
  school: School | null
  updateFields: (fields: Partial<CreateCourseFormData>) => void
}

const CourseInfoForm: FC<Props> = ({
  name,
  color,
  year,
  degreeYear,
  term,
  instructor,
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
      <h1 className="text-3xl font-bold text-slate-500 dark:text-neutral-200">
        Create a Course
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
          value={code}
          onChange={(e) => updateFields({ code: e.target.value })}
          label="Course Code"
          autoComplete={false}
          required
        />
        <InputSegment
          value={degreeYear ?? ''}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ degreeYear: e.target.value.replace(/\D/g, '') })
          }}
          label="Year of Degree"
          autoComplete={false}
          required
          maxLength={1}
        />
        <InputSegment
          value={credits}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ credits: e.target.value.replace(/\D/g, '') })
          }}
          label="Credits"
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
      <div className="flex w-full gap-4">
        <InputSegment
          animate={false}
          value={year}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ year: e.target.value.replace(/\D/g, '') })
          }}
          label="Year"
          containerStyles={{
            flexGrow: 1,
          }}
          required
          maxLength={4}
          minLength={4}
        />
        <div className="my-2 flex h-auto w-full flex-col gap-1">
          <label
            htmlFor="term-select"
            className="h-6 text-slate-500 dark:text-neutral-400"
          >
            Term
          </label>
          <select
            id="term-select"
            className={`peer h-full max-h-14 w-full flex-grow rounded-xl bg-white px-4 py-3 text-lg text-black outline-none transition-all duration-200 ease-linear placeholder:text-gray-400 focus:shadow-inner-lg focus:brightness-100 dark:bg-zinc-600 dark:text-white ${
              term ? 'shadow-inner-lg brightness-100' : 'brightness-95'
            }`}
            value={term}
            onChange={(e) => updateFields({ term: e.target.value })}
            required
          >
            <option value="F">Fall</option>
            <option value="W">Winter</option>
            <option value="S">Summer</option>
          </select>
        </div>
      </div>
      <InputSegment
        value={instructor}
        onChange={(e) => updateFields({ instructor: e.target.value })}
        label="Course Instructor"
        required
        autoComplete={false}
      />
    </Widget>
  )
}

export default CourseInfoForm
