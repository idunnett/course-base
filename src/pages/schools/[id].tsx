import CourseInfoButton from '../../components/course/CourseInfoButton'
import Widget from '../../components/common/Widget'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'
import LoadingOrError from '../../components/common/LoadingOrError'
import DegreeButton from '../../components/degree/DegreeButton'
import { RiBuilding2Line, RiGroupLine } from 'react-icons/ri'

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
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-end gap-2">
          <h1
            className="flex items-center gap-1 rounded-md p-2 pl-1 text-3xl font-semibold text-slate-500 dark:text-neutral-400"
            style={{
              color: school.secondaryColor,
              backgroundColor: school.color,
            }}
          >
            <RiBuilding2Line fontSize={36} />
            {school.name}
          </h1>
          <p className="flex items-center gap-1 whitespace-nowrap text-lg font-normal text-slate-500 dark:text-neutral-400">
            <RiGroupLine />
            <span>
              {school._count.users} member
              {school._count.users !== 1 && 's'}
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
            {school.degrees
              ? school.degrees.map((degree) => (
                  <DegreeButton
                    key={degree.id}
                    degree={{ ...degree, school }}
                    onClick={() => router.push(`/degrees/${degree.id}`)}
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
            <Link href="/degrees/new" className="primary-btn">
              New
            </Link>
          </Widget>
          <Widget className="flex h-min w-full flex-col gap-2">
            <h2 className="flex items-end gap-2 text-lg font-semibold text-slate-500 dark:text-neutral-200">
              Courses{' '}
              <span className="text-sm font-normal text-slate-400 dark:text-neutral-400">
                {school._count.courseInfos} total
              </span>
            </h2>
            {school.courseInfos
              ? school.courseInfos.map((courseInfo) => (
                  <CourseInfoButton
                    key={courseInfo.id}
                    course={{ ...courseInfo, school }}
                    onClick={() => router.push(`/courses/${courseInfo.id}`)}
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
            <Link href="/courses/new" className="primary-btn">
              New
            </Link>
          </Widget>
        </div>
      </div>
    )

  return <LoadingOrError error={error?.message} />
}

export default School
