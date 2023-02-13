import type { Dispatch, FC, SetStateAction } from 'react'
import type { FullCourseInfo } from '../../../types'
import CourseButton from '../CourseButton'

interface Props {
  courses?: FullCourseInfo[]
  selectedCourse: FullCourseInfo | null
  setSelectedCourse: Dispatch<SetStateAction<FullCourseInfo | null>>
}

const CourseList: FC<Props> = ({
  courses,
  selectedCourse,
  setSelectedCourse,
}) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {courses?.map((course) => (
        <CourseButton
          key={course.id}
          course={course}
          onClick={() => setSelectedCourse(course)}
          className={selectedCourse?.id === course.id ? 'active' : undefined}
        />
      ))}
    </div>
  )
}

export default CourseList
