import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { RiLoader5Line } from 'react-icons/ri'
import { PieChart } from 'react-minimal-pie-chart'
import { alertAtom, myCoursesAtom } from '../../atoms'
import Widget from '../../components/common/Widget'
import CourseDetails from '../../components/course/CourseDetails'
import CourseSearchForm from '../../components/course/CourseSearchForm'
import type { FullCourseInfo } from '../../types'
import { trpc } from '../../utils/trpc'

const CourseSearch = () => {
  const router = useRouter()
  const setAlert = useSetAtom(alertAtom)
  const setMyCourses = useSetAtom(myCoursesAtom)
  const [selectedCourse, setSelectedCourse] = useState<FullCourseInfo | null>(
    null
  )
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)

  const { refetch, isFetching } = trpc.courseInfo.variations.useQuery(
    selectedCourse?.id as string,
    {
      queryKey: ['courseInfo.variations', '1'],
      enabled: !!selectedCourse?.id,
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

  const { data: myCourseIds } = trpc.course.myCourseIds.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { mutate: joinCourse, isLoading: isJoining } =
    trpc.course.join.useMutation({
      onSuccess: (data) => {
        if (!data)
          return setAlert({
            type: 'error',
            message: 'Failed to join course',
          })
        setAlert({
          type: 'success',
          message: 'Successfully joined course',
        })
        setMyCourses((prev) => {
          if (!prev) return [data]
          return [...prev, data]
        })
        router.push(`/my/courses/${data.id}`)
      },
      onError: () =>
        setAlert({
          type: 'error',
          message: 'Failed to join course',
        }),
    })

  useEffect(() => {
    if (selectedCourse && !selectedCourse.courses.length && !isFetching) {
      refetch({
        queryKey: ['courseInfo.variations', '1'],
      })
    }
  }, [isFetching, refetch, selectedCourse])

  return (
    <div className="relative -mt-12 flex h-screen w-full gap-1 px-4 pt-12">
      <div className="w-7/12">
        <CourseSearchForm
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      </div>

      <div className="relative w-5/12 overflow-y-auto px-4 scrollbar-hide">
        {selectedCourse && selectedCourse.courses.length > 0 && !isFetching ? (
          <Widget className="my-4 w-full">
            <div className="flex flex-col gap-4">
              <CourseDetails
                courseInfo={selectedCourse}
                setActiveCourseId={setActiveCourseId}
              />
              {myCourseIds && activeCourseId && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    disabled={myCourseIds.includes(activeCourseId)}
                    className={`primary-btn px-4 text-2xl ${
                      myCourseIds.includes(activeCourseId) &&
                      'cursor-not-allowed opacity-50 hover:bg-slate-500'
                    }`}
                    onClick={() => joinCourse(activeCourseId)}
                  >
                    {isJoining ? (
                      <RiLoader5Line className="animate-spin dark:text-white" />
                    ) : (
                      'Join'
                    )}
                  </button>
                  {myCourseIds.includes(activeCourseId) && (
                    <p className="text-sm text-slate-400 dark:text-white">
                      You are already in this course.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Widget>
        ) : (
          <Widget className="relative my-4 flex w-full animate-pulse flex-col items-center py-48">
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
                height: 200,
                width: 200,
                overflow: 'visible',
              }}
              className="text-slate-500 opacity-5 dark:text-neutral-400"
            />
          </Widget>
        )}
      </div>
    </div>
  )
}

export default CourseSearch
