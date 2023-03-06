import type { Dispatch, FC, SetStateAction } from 'react'
import type { FullCourseInfo } from '../../../types'
import CourseInfoButton from '../CourseInfoButton'

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
        <CourseInfoButton
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
