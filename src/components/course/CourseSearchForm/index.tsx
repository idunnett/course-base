import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useState,
} from 'react'
import { FaSpinner } from 'react-icons/fa'
import CourseList from './CourseList'
import Link from 'next/link'
import InputSegment from '../../common/InputSegment'
import Form from '../../common/Form'
import useDebounce from '../../../hooks/useDebounce'
import { useRouter } from 'next/router'
import { trpc } from '../../../utils/trpc'
import type { FullCourseInfo } from '../../../types'

interface Props {
  selectedCourse: FullCourseInfo | null
  setSelectedCourse: Dispatch<SetStateAction<FullCourseInfo | null>>
}

const CourseSearchForm: FC<Props> = ({ selectedCourse, setSelectedCourse }) => {
  const router = useRouter()

  const [courseInput, setCourseInput] = useState('')
  const debouncedCourseInput = useDebounce(courseInput, 300)

  const { mutate: joinCourse, isLoading: isJoining } =
    trpc.course.join.useMutation({
      onSuccess: (data) => router.push(`/courses/${data.id}`),
      onError: (error) => alert(error.message),
    })

  const { data: courses, isFetching } = trpc.courseInfo.search.useQuery(
    {
      searchVal: debouncedCourseInput,
    },
    {
      queryKey: ['courseInfo.search', debouncedCourseInput],
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (courses?.items && courses.items[0]) {
      setSelectedCourse(courses.items[0])
    } else {
      setSelectedCourse(null)
    }
  }, [courses])

  const handleSubmit = () => {
    if (!selectedCourse) return alert('Please select a course to join')
    joinCourse(selectedCourse.id)
  }

  // const handleLoadMore = () => {
  //   searchCourses(token, courseInput, lastKey, courses)
  // }

  return (
    <div className="relative row-span-2 h-full w-full">
      <Form title="Find your course">
        <InputSegment
          value={courseInput}
          onChange={(e) => setCourseInput(e.target.value)}
          autoFocus={true}
          autoComplete={false}
          placeholder="Course name"
        />
        <div className="flex items-center justify-between">
          {isFetching && (
            <FaSpinner className="ml-2 animate-spin dark:text-neutral-200" />
          )}
          <div className="flex w-full justify-end">
            <Link href="/courses/new" className="secondary-btn">
              Create new
            </Link>
            {selectedCourse && (
              <button
                type="button"
                onClick={handleSubmit}
                className="primary-btn"
              >
                {isJoining ? <FaSpinner className="animate-spin" /> : 'Join'}
              </button>
            )}
          </div>
        </div>
        <CourseList
          courses={courses?.items}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
        {/* {hasMore && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="text-slate-500 text-sm"
            >
              Load more
            </button>
          </div>
        )} */}
      </Form>
    </div>
  )
}

export default CourseSearchForm
