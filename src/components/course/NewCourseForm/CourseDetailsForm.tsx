import type { FC } from 'react'
import type { CreateCourseFormData } from '../../../types'
import InputSegment from '../../common/InputSegment'
import Widget from '../../common/Widget'
import LocationAutoComplete from './LocationAutoComplete'

interface Props {
  year: string
  term: string
  instructor: string
  color?: string
  lat: number | null
  lng: number | null
  updateFields: (fields: Partial<CreateCourseFormData>) => void
}

const CourseDetailsForm: FC<Props> = ({
  year,
  term,
  instructor,
  color,
  lat,
  lng,
  updateFields,
}) => {
  return (
    <Widget>
      <h1 className="text-2xl font-bold text-slate-500 dark:text-neutral-200">
        Course Details
      </h1>
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
        <div className="my-1 flex h-auto w-full flex-col gap-1">
          <label
            htmlFor="term-select"
            className="h-6 text-slate-500 dark:text-neutral-400"
          >
            Term
          </label>
          <select
            id="term-select"
            className={`peer h-full max-h-11 w-full flex-grow rounded-xl bg-white px-4 py-2 text-lg text-black outline-none transition-all duration-200 ease-linear placeholder:text-gray-400 focus:shadow-inner-lg focus:brightness-100 dark:bg-zinc-600 dark:text-white ${
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
      <LocationAutoComplete
        lat={lat}
        lng={lng}
        setLat={(val: number) => updateFields({ lat: val })}
        setLng={(val: number) => updateFields({ lng: val })}
        color={color}
      />
    </Widget>
  )
}
export default CourseDetailsForm
