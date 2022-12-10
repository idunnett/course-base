import { BiBuildings } from 'react-icons/bi'
import CourseButton from '../../../components/course/CourseButton'
import Widget from '../../../components/common/Widget'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { trpc } from '../../../utils/trpc'
import LoadingOrError from '../../../components/common/LoadingOrError'
import { HiUsers } from 'react-icons/hi'

const School = () => {
  const router = useRouter()
  const { id } = router.query

  const {
    data: school,
    isLoading: isLoading,
    error,
  } = trpc.school.findByIdPreview.useQuery(id as string, {
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (!isLoading && school)
    return (
      <div className="flex h-full flex-col gap-4 p-4 pt-16">
        <div className="flex items-end gap-2">
          <h1
            className="flex items-center gap-1 rounded-md p-2 pl-1 text-4xl font-bold text-slate-500 dark:text-neutral-400"
            style={{
              color: school.secondaryColor,
              backgroundColor: school.color,
            }}
          >
            <BiBuildings fontSize={48} />
            {school.name}
          </h1>
          <p className="flex items-center gap-1 whitespace-nowrap text-lg font-normal text-slate-500 dark:text-neutral-400">
            <HiUsers />
            <span>
              {school.memberCount} member
              {school.memberCount !== 1 && 's'}
            </span>
          </p>
        </div>
        <div className="flex gap-2 text-slate-500">
          <Widget className="flex h-min w-full flex-col gap-2">
            <h2 className="text-lg font-semibold text-slate-500 dark:text-neutral-200">
              Degrees{' '}
              <span className="text-sm font-normal text-slate-400 dark:text-neutral-400">
                {school._count.degrees} total
              </span>
            </h2>
            <Link href={`/schools/${id}/degrees/new`} className="primary-btn">
              New
            </Link>
          </Widget>
          <Widget className="flex h-min w-full flex-col gap-2">
            <h2 className="flex items-end gap-2 text-lg font-semibold text-slate-500 dark:text-neutral-200">
              Courses{' '}
              <span className="text-sm font-normal text-slate-400 dark:text-neutral-400">
                {school._count.courses} total
              </span>
            </h2>
            {school.courses
              ? school.courses.map((course) => (
                  <CourseButton
                    key={course.id}
                    course={{ ...course, school: school }}
                    onClick={() => router.push(`/courses/${course.id}`)}
                    showSchool={false}
                  />
                ))
              : [...Array(Number(5))].map((_, index) => (
                  <div
                    key={index}
                    className="list-button h-[68px] animate-pulse"
                    style={{
                      animationDelay: `${index / 5}s`,
                      animationDuration: '1s',
                    }}
                  />
                ))}
            <Link href={`/schools/${id}/courses/new`} className="primary-btn">
              New
            </Link>
          </Widget>
        </div>
      </div>
    )

  return <LoadingOrError error={error?.message} />
}

export default School
