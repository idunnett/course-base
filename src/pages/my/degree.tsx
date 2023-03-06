import { useSession } from 'next-auth/react'
import { FC, useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import LoadingOrError from '../../components/common/LoadingOrError'
import { trpc } from '../../utils/trpc'
import { RiExternalLinkLine, RiLink, RiTimeLine } from 'react-icons/ri'
import Members from '../../components/common/Members'
import SchoolTag from '../../components/school/SchoolTag'
import { AiOutlineBarChart } from 'react-icons/ai'
import DegreeCourseLinkModal from '../../components/degree/DegreeCourseLinkModal'
import Link from 'next/link'
import _ from 'lodash'

type DegreeTableColumns = {
  completed: boolean
  courseCode: string
  link?: string
  name: string
  term: string
  degreeYear: number
  grade?: number
  credits: number
  courseInfoId?: string
  linkedCourseId?: string
  color?: string
}

const columnHelper = createColumnHelper<DegreeTableColumns | number>()

const Degree: FC = () => {
  const { data: session } = useSession()
  const [data, setData] = useState<(DegreeTableColumns | number)[]>([])
  const [courseInfoIdToLinkTo, setCourseInfoIdToLinkTo] = useState<
    string | null
  >(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor('completed', {
        header: 'Completed',
        cell: (info) => (
          <input readOnly type="checkbox" checked={info.getValue()} />
        ),
      }),
      columnHelper.accessor('link', {
        header: 'Link',
        cell: (info) => {
          const row = info.row.original
          if (typeof row !== 'number') {
            const { courseInfoId, linkedCourseId } = row
            if (courseInfoId) {
              if (linkedCourseId)
                return (
                  <Link
                    href={`/my/courses/${linkedCourseId}`}
                    className="pointer-cursor flex w-full items-center justify-center"
                  >
                    <RiExternalLinkLine />
                  </Link>
                )
              else
                return (
                  <button
                    onClick={() => setCourseInfoIdToLinkTo(courseInfoId)}
                    className="pointer-cursor flex w-full items-center justify-center"
                  >
                    <RiLink />
                  </button>
                )
            }
          }
        },
      }),
      columnHelper.accessor('courseCode', {
        header: 'Course',
        cell: (info) => {
          if (typeof info.row.original === 'number') return
          return info.row.original.color ? (
            <div className="flex items-center gap-1">
              <AiOutlineBarChart
                className="h-4 w-4"
                style={{
                  color: info.row.original.color,
                }}
              />
              {info.getValue()}
            </div>
          ) : (
            info.getValue()
          )
        },
      }),
      columnHelper.accessor('name', {
        header: 'Name',
      }),
      columnHelper.accessor('term', {
        header: 'Term',
      }),
      columnHelper.accessor('grade', {
        header: 'Grade',
        cell: (info) => {
          const grade = info.getValue()
          if (grade != null) return `${grade}%`
        },
      }),
      columnHelper.accessor('credits', {
        header: 'Credits',
        footer: (info) => {
          const totalCredits = info.table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => {
              if (typeof row.original === 'number') return sum
              return sum + row.original.credits
            }, 0)
          return totalCredits
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const {
    data: degree,
    isLoading,
    error,
  } = trpc.degree.findById.useQuery(session?.user?.degreeId as string, {
    enabled: !!session?.user?.degreeId,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (degree) => {
      const { courseInfos, partialCourses, subjectRequirements } = degree
      const coursesArray: DegreeTableColumns[] = [
        ...courseInfos.map(({ courseInfo }) => ({
          completed: false,
          term: '',
          degreeYear: courseInfo.degreeYear,
          courseCode: courseInfo.code,
          name: courseInfo.name,
          credits: courseInfo.credits,
          color: courseInfo.color,
          courseInfoId: courseInfo.id,
        })),
        ...partialCourses.map((partialCourse) => ({
          completed: false,
          term: '',
          degreeYear: partialCourse.degreeYear,
          courseCode: partialCourse.code,
          name: partialCourse.name,
          credits: partialCourse.credits,
        })),
      ].sort((a, b) => a.degreeYear - b.degreeYear)

      const splitYearCourses = Object.values(
        coursesArray.reduce(
          (acc: { [key: number]: (DegreeTableColumns | number)[] }, x) => {
            acc[(x as DegreeTableColumns).degreeYear] = [
              ...(acc[(x as DegreeTableColumns).degreeYear] || []),
              x as DegreeTableColumns,
            ]
            return acc
          },
          {}
        )
      )
      splitYearCourses.forEach((yearCourses, i) => {
        yearCourses.unshift(i + 1)
      })
      // flatten array into one array
      const coursesArrayFlattened = splitYearCourses.flat()
      coursesArrayFlattened.push(-1)
      const subjectRequirementsArray: DegreeTableColumns[] = []
      for (const subjectRequirement of subjectRequirements) {
        const { subject, credits, year, orHigher } = subjectRequirement
        let joinedSubjectName = ''
        subject.forEach((subjectName, i) => {
          if (i === 0) joinedSubjectName += subjectName
          else if (i === subject.length - 1)
            joinedSubjectName += ` or ${subjectName}`
          else joinedSubjectName += `, ${subjectName}`
        })
        joinedSubjectName += `, year ${year}`
        if (orHigher) joinedSubjectName += ' (or above)'
        subjectRequirementsArray.push({
          completed: false,
          term: '',
          degreeYear: year,
          courseCode: joinedSubjectName,
          name: '',
          credits,
        })
      }
      subjectRequirementsArray.sort(
        (a: any, b: any) => a.degreeYear - b.degreeYear
      )
      setData([...coursesArrayFlattened, ...subjectRequirementsArray])
    },
  })

  trpc.degree.myUserDegreeCourses.useQuery(degree?.id as string, {
    enabled: !!degree?.id && data.length > 0,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (myUserDegreeCourses) => {
      const updatedData = _.cloneDeep(data)
      for (const myUserDegreeCourse of myUserDegreeCourses) {
        const { courseInfoId, courseId, completed, term, grade } =
          myUserDegreeCourse
        const courseRow = updatedData.find(
          (courseRow) =>
            typeof courseRow !== 'number' &&
            courseRow.courseInfoId === courseInfoId
        )
        if (typeof courseRow !== 'number' && courseRow) {
          courseRow.completed = completed
          courseRow.linkedCourseId = courseId ?? undefined
          courseRow.term = term
          courseRow.grade = grade === null ? undefined : grade
        }
      }
      setData(updatedData)
    },
  })

  if (!isLoading && degree)
    return (
      <div className="p-4 pt-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-600 dark:text-neutral-100">
            {degree.name}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-sm font-light text-slate-500 dark:text-neutral-400">
              <div className="flex items-center gap-0.5">
                <RiTimeLine />
                <span>{degree.credits} credits</span>
              </div>
              <Members number={degree._count.users} />
              <p>For Admissions in {degree.admissionYear}</p>
            </div>
            <SchoolTag
              school={degree.school}
              className="px-1 py-0 text-sm font-normal"
            />
          </div>
          <table className="border border-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-200 py-1 px-3 text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) =>
                typeof row.original === 'number' ? (
                  <tr
                    key={'divider-' + index}
                    className="border border-gray-200 bg-gray-100"
                  >
                    <td
                      colSpan={table.getAllColumns().length}
                      className="border border-gray-200 px-3 text-left"
                    >
                      <span className="text-sm font-medium text-slate-600 dark:text-neutral-100">
                        {row.original > 0
                          ? `Year ${row.original} Required Courses`
                          : 'Other Required Courses'}
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={row.id}
                    className={`border border-gray-200 ${
                      index % 2 == 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border border-gray-200 py-1 px-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-200 py-1 px-3 text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
        {courseInfoIdToLinkTo && (
          <DegreeCourseLinkModal
            degreeId={degree.id}
            courseInfoIdToLinkTo={courseInfoIdToLinkTo}
            setCourseInfoIdToLinkTo={setCourseInfoIdToLinkTo}
          />
        )}
      </div>
    )

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingOrError error={error?.message} />
    </div>
  )
}

export default Degree
