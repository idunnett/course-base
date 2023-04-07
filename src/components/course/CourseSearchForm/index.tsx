import { type Dispatch, type FC, type SetStateAction, useState } from 'react'
import CourseList from './CourseList'
import Link from 'next/link'
import InputSegment from '../../common/InputSegment'
import Form from '../../common/Form'
import useDebounce from '../../../hooks/useDebounce'
import type { FullCourseInfo } from '../../../types'
import { RiLoader5Line } from 'react-icons/ri'
import { trpc } from '../../../utils/trpc'

interface Props {
  selectedCourse: FullCourseInfo | null
  setSelectedCourse: Dispatch<SetStateAction<FullCourseInfo | null>>
}

const CourseSearchForm: FC<Props> = ({ selectedCourse, setSelectedCourse }) => {
  const [courseInput, setCourseInput] = useState('')
  const debouncedCourseInput = useDebounce(courseInput, 300)

  const { data: courses, isFetching } = trpc.courseInfo.search.useQuery(
    {
      searchVal: debouncedCourseInput,
    },
    {
      queryKey: ['courseInfo.search', debouncedCourseInput],
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.items && data.items[0]) setSelectedCourse(data.items[0])
        else setSelectedCourse(null)
      },
    }
  )

  // const handleLoadMore = () => {
  //   searchCourses(token, courseInput, lastKey, courses)
  // }

  return (
    <div className="relative row-span-2 h-full w-full">
      <Form title="Find your course" className="!gap-1">
        <InputSegment
          value={courseInput}
          onChange={(e) => setCourseInput(e.target.value)}
          autoFocus={true}
          autoComplete={false}
          placeholder="Course name"
        />
        <div className="flex items-center justify-between">
          {isFetching && (
            <RiLoader5Line className="ml-2 animate-spin dark:text-neutral-200" />
          )}
          <div className="flex w-full justify-end">
            <Link
              href="/courses/new"
              className="secondary-btn dark:text-neutral-200 dark:hover:bg-zinc-700"
            >
              Create new
            </Link>
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
