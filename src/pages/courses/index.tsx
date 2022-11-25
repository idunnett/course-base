import { useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import CourseDetails from '../../components/course/CourseDetails'
import CourseSearchForm from '../../components/course/CourseSearchForm'
import { FullCourse } from '../../types'

const CourseSearch = () => {
  const [selectedCourse, setSelectedCourse] = useState<FullCourse | null>(null)

  return (
    <div className="flex w-full p-4 pt-16">
      <CourseSearchForm
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />
      {selectedCourse ? (
        <CourseDetails course={selectedCourse} />
      ) : (
        <div className="relative mt-24 flex w-full animate-pulse flex-col items-center">
          <PieChart
            startAngle={90}
            lineWidth={20}
            paddingAngle={18}
            rounded
            data={[
              { value: 30, color: '#000' },
              { value: 10, color: '#000' },
              { value: 25, color: '#000' },
              { value: 35, color: '#000' },
            ]}
            totalValue={100}
            style={{
              height: 250,
              width: 250,
              overflow: 'visible',
            }}
            className="text-slate-500 opacity-5 dark:text-neutral-400"
          />
        </div>
      )}
    </div>
  )
}

export default CourseSearch
