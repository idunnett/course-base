import { FC, useState } from 'react'
import _ from 'lodash'
import { FiX } from 'react-icons/fi'
import {
  CreateDegreeFormData,
  CreateSubjectRequirement,
} from '../../../../../types'
import Widget from '../../../../common/Widget'
import SubjectRequirementButton from './SubjectRequirementButton'
import { HiDuplicate } from 'react-icons/hi'
import SubjectEditRow from './SubjectEditRow'

interface Props {
  subjectRequirements: Array<CreateSubjectRequirement>
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const SubjectRequirements: FC<Props> = ({
  subjectRequirements,
  updateFields,
}) => {
  const [showAddSubject, setShowAddSubject] = useState<number | null>(null)

  return (
    <>
      <h2 className="mt-4 text-xl font-semibold text-slate-500 dark:text-neutral-200">
        Subject Requirements
      </h2>
      <div className="flex flex-col gap-1">
        <Widget className="relative flex flex-col gap-1">
          {subjectRequirements.map((subjectRequirement, index) =>
            showAddSubject === index ? (
              <SubjectEditRow
                key={index}
                subjectRequirements={subjectRequirements}
                showAddSubject={showAddSubject}
                setShowAddSubject={setShowAddSubject}
                updateFields={updateFields}
              />
            ) : (
              <div className="flex items-center gap-2" key={index}>
                <button
                  type="button"
                  className="secondary-btn px-0"
                  onClick={() => {
                    const updatedSubjectRequirements =
                      _.cloneDeep(subjectRequirements)
                    updatedSubjectRequirements.splice(index, 1)
                    updateFields({
                      subjectRequirements: updatedSubjectRequirements,
                    })
                  }}
                >
                  <FiX className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="secondary-btn px-0"
                  onClick={() => {
                    const updatedSubjectRequirements =
                      _.cloneDeep(subjectRequirements)
                    const newSubjectReq = updatedSubjectRequirements[index]
                    if (newSubjectReq) {
                      updatedSubjectRequirements.splice(index, 0, newSubjectReq)
                      updateFields({
                        subjectRequirements: updatedSubjectRequirements,
                      })
                    }
                  }}
                >
                  <HiDuplicate className="h-5 w-5" />
                </button>
                <SubjectRequirementButton
                  subjectRequirement={subjectRequirement}
                  onClick={() => setShowAddSubject(index)}
                />
              </div>
            )
          )}
          {!!showAddSubject && showAddSubject < 0 && (
            <SubjectEditRow
              subjectRequirements={subjectRequirements}
              setShowAddSubject={setShowAddSubject}
              updateFields={updateFields}
            />
          )}
          {!showAddSubject && (
            <div className="relative flex w-full items-center justify-center">
              <button
                type="button"
                className="secondary-btn py-1.5 text-sm font-normal"
                onClick={() => {
                  setShowAddSubject(-1)
                }}
              >
                Add Subject
              </button>
            </div>
          )}
        </Widget>
      </div>
    </>
  )
}

export default SubjectRequirements
