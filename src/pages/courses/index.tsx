import { useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import Widget from '../../components/common/Widget'
import CourseDetails from '../../components/course/CourseDetails'
import CourseSearchForm from '../../components/course/CourseSearchForm'
import type { FullCourseInfo } from '../../types'
import { trpc } from '../../utils/trpc'

const CourseSearch = () => {
  const [selectedCourse, setSelectedCourse] = useState<FullCourseInfo | null>(
    null
  )

  const { isLoading } = trpc.courseInfo.variations.useQuery(
    selectedCourse?.id as string,
    {
      enabled: !!selectedCourse,
      queryKey: ['courseInfo.variations', selectedCourse?.id as string],
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (data) => {
        if (!selectedCourse) return
        const updatedCourse = {
          ...selectedCourse,
          courses: data,
        }
        setSelectedCourse(updatedCourse)
      },
    }
  )

  return (
    <div className="relative flex h-full w-full gap-2 px-4 pt-12">
      <div className="w-7/12">
        <CourseSearchForm
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      </div>
      {selectedCourse && selectedCourse.courses.length > 0 ? (
        <div className="relative w-5/12 overflow-y-auto scrollbar-hide">
          <Widget className="my-4 w-full">
            <div className="flex flex-col gap-4">
              <CourseDetails courseInfo={selectedCourse} />
            </div>
          </Widget>
        </div>
      ) : (
        <Widget className="relative flex h-full w-5/12 animate-pulse flex-col items-center pt-40">
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
        </Widget>
      )}
    </div>
  )
}

export default CourseSearch
