import { Degree, School } from '@prisma/client'
import { ButtonHTMLAttributes, FC } from 'react'
import { BiBuildings } from 'react-icons/bi'
import { HiClock, HiUsers } from 'react-icons/hi'
import Members from '../common/Members'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  degree: Degree & {
    school: School
  }
}

const DegreeButton: FC<Props> = ({ degree, ...props }) => {
  return (
    <button
      key={degree.id}
      className="list-button flex-col justify-between"
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-1 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
            {degree.name}
          </h2>
          <p className="text-md text-base font-normal text-slate-500 dark:text-neutral-400">
            {degree.years} years
          </p>
        </div>
        <span className="whitespace-nowrap text-base font-normal text-slate-500 dark:text-neutral-300">
          {degree.admissionYear}
        </span>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex gap-3 whitespace-nowrap text-sm font-light text-slate-500 dark:text-neutral-400">
          <div className="flex items-center gap-0.5">
            <HiClock />
            <span>{degree.credits}</span>
          </div>
          <Members
            number={degree.memberCount}
            showText={false}
            className="!gap-0.5"
          />
        </div>
        <div
          className="flex items-center gap-1 rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
          style={{
            color: degree.school?.secondaryColor,
            backgroundColor: degree.school?.color,
          }}
        >
          <BiBuildings />
          {degree.school?.name}
        </div>
      </div>
    </button>
  )
}

export default DegreeButton
