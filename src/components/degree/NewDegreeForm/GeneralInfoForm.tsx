import { School } from '@prisma/client'
import { CreateDegreeFormData } from '../../../types'
import InputSegment from '../../common/InputSegment'
import Widget from '../../common/Widget'
import SchoolAutoComplete from '../../school/SchoolAutoComplete'

interface Props {
  name: string
  school: School | null
  degreeYears: string
  creditHours: string
  admissionYear: string
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const GeneralInfoForm: React.FC<Props> = ({
  name,
  school,
  degreeYears,
  creditHours,
  admissionYear,
  updateFields,
}) => {
  return (
    <Widget className="p-4">
      <h2 className="text-3xl font-bold text-slate-500 dark:text-neutral-200">
        Create a Degree
      </h2>
      <InputSegment
        label="Degree name"
        autoFocus
        required
        value={name}
        onChange={(e) => updateFields({ name: e.target.value })}
      />
      <SchoolAutoComplete
        onInitialFetch={(school: School) => updateFields({ school })}
        onSelect={(school: School) => updateFields({ school })}
        school={school}
      />
      <div className="flex justify-between gap-4">
        <InputSegment
          label="Degree years"
          required
          value={degreeYears}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ degreeYears: e.target.value.replace(/\D/g, '') })
          }}
          maxLength={1}
        />
        <InputSegment
          label="Credit hours"
          required
          value={creditHours}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ creditHours: e.target.value.replace(/\D/g, '') })
          }}
          maxLength={3}
        />
        <InputSegment
          label="Admission year"
          required
          value={admissionYear}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ admissionYear: e.target.value.replace(/\D/g, '') })
          }}
          maxLength={4}
        />
      </div>
    </Widget>
  )
}

export default GeneralInfoForm
