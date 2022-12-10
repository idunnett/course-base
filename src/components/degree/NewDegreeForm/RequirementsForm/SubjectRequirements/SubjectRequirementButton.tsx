import type { SubjectRequirement } from '@prisma/client'
import type { ButtonHTMLAttributes, FC } from 'react'
import { HiClock } from 'react-icons/hi'
import type { CreateSubjectRequirement } from '../../../../../types'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  subjectRequirement: CreateSubjectRequirement | SubjectRequirement
}

const SubjectRequirementButton: FC<Props> = ({
  subjectRequirement,
  ...props
}) => {
  return (
    <button
      type="button"
      className="list-button flex items-center justify-between gap-1"
      {...props}
    >
      <div className="flex flex-wrap items-center text-base">
        {subjectRequirement.subject.map((subject, index) => (
          <p
            key={subject}
            className="flex items-center font-normal text-slate-400"
          >
            <span className="whitespace-nowrap text-slate-600 dark:text-neutral-300">
              {subject}
            </span>
            {!!subjectRequirement.subject.length &&
            index !== subjectRequirement.subject.length - 1 ? (
              index === subjectRequirement.subject.length - 2 ? (
                <span className="mx-1 font-light">or</span>
              ) : (
                <span className="mr-1 font-light">,</span>
              )
            ) : null}
          </p>
        ))}
      </div>
      <span className="whitespace-nowrap text-sm font-light text-slate-600 dark:text-neutral-400">
        Year {subjectRequirement.year}
        {subjectRequirement.orHigher && '(+)'}
      </span>
      <div className="flex items-center gap-0.5 whitespace-nowrap text-sm font-light text-slate-600 dark:text-neutral-400">
        <HiClock />
        <span>{subjectRequirement.credits}</span>
      </div>
    </button>
  )
}

export default SubjectRequirementButton
