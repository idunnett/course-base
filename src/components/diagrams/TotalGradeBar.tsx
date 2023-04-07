import { type FC, useMemo } from 'react'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { getTotalCurrentGrade } from '../../utils/diagramUtils'
import type { Task } from '@prisma/client'
import type { FullCourse } from '../../types'

interface Props {
  course: FullCourse
  tasks: Task[]
}

const TotalGradeBar: FC<Props> = ({ course, tasks }) => {
  const grade = useMemo(
    () => getTotalCurrentGrade(course, tasks),
    [course, tasks]
  )
  return (
    <div className="relative mt-1 rounded-md bg-gray-400 bg-opacity-20 p-[1px] text-sm text-white">
      <motion.div
        className="h-full rounded-md py-0.5 text-right"
        initial={{
          width: 0,
        }}
        animate={{
          width: `${grade}%`,
        }}
        transition={{
          duration: grade / 100,
        }}
        style={{
          backgroundColor: course.info.color,
        }}
      >
        <CountUp
          end={grade}
          duration={grade / 100}
          decimals={2}
          decimal="."
          suffix="%"
          className="mx-1"
        />
      </motion.div>
    </div>
  )
}

export default TotalGradeBar
