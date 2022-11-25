import { FC, useState } from 'react'
import Link from 'next/link'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { AiOutlineBarChart, AiOutlineDotChart } from 'react-icons/ai'
import Widget from '../common/Widget'
import { Course, Segment, Task } from '@prisma/client'
import GradesBarGraph from '../diagrams/GradesBarGraph'
import TotalGradeBar from '../diagrams/TotalGradeBar'
import ScatterChart from '../diagrams/ScatterChart'

interface Props {
  course: Course & { segments: Segment[] }
  tasks: Task[]
}

const CourseWidget: FC<Props> = ({ course, tasks }) => {
  const [currentDiagram, setCurrentDiagram] = useState('bar')

  const handleCurrentDiagram = () => {
    switch (currentDiagram) {
      case 'scatter':
        return <ScatterChart course={course} tasks={tasks} />
      default:
        return <GradesBarGraph course={course} tasks={tasks} />
    }
  }

  return (
    <Widget className="relative flex h-96 w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <Link href={`/my/courses/${course.id}`}>
          <h1
            className="group flex items-center text-2xl font-semibold"
            style={{
              color: course.color,
            }}
          >
            {course.name}
            <MdKeyboardArrowRight className="opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100" />
          </h1>
        </Link>
        <div className="flex h-full gap-1">
          <button
            onClick={() => setCurrentDiagram('bar')}
            className={`group ${
              currentDiagram === 'bar'
                ? 'text-slate-500 dark:text-gray-300'
                : 'text-slate-400 dark:text-gray-400'
            }`}
          >
            <AiOutlineBarChart className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentDiagram('scatter')}
            className={`group ${
              currentDiagram === 'scatter'
                ? 'text-slate-500 dark:text-gray-300'
                : 'text-slate-400 dark:text-gray-400'
            }`}
          >
            <AiOutlineDotChart className="h-6 w-6" />
          </button>
        </div>
      </div>
      {handleCurrentDiagram()}
      <TotalGradeBar course={course} tasks={tasks} />
    </Widget>
  )
}

export default CourseWidget
