import { useSession } from 'next-auth/react'
import { FC, Suspense, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import LoadingOrError from '../../components/common/LoadingOrError'
import Modal from '../../components/common/Modal'
import CourseDetails from '../../components/course/CourseDetails'
import DegreeDetails from '../../components/degree/DegreeDetails'
import type { FullCourseInfo } from '../../types'
import { trpc } from '../../utils/trpc'
import { drop } from 'lodash'
import { RiTimeLine } from 'react-icons/ri'
import Members from '../../components/common/Members'
import SchoolTag from '../../components/school/SchoolTag'
import { AiOutlineBarChart } from 'react-icons/ai'

type DegreeTableColumns = {
  completed: boolean
  term: string
  degreeYear: number
  grade: string
  course: string
  name: string
  equivalent: string
  credits: number
  color?: string
}

const columnHelper = createColumnHelper<DegreeTableColumns>()

const columns = [
  columnHelper.accessor('completed', {
    header: 'Completed',
    cell: (info) => (
      <input readOnly type="checkbox" checked={info.getValue()} />
    ),
  }),
  columnHelper.accessor('term', {
    header: 'Term',
  }),
  columnHelper.accessor('grade', {
    header: 'Grade',
  }),
  columnHelper.accessor('course', {
    header: 'Course',
    cell: (info) =>
      info.row.original.color ? (
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
      ),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('equivalent', {
    header: 'Equivalent',
  }),
  columnHelper.accessor('credits', {
    header: 'Credits',
  }),
]

const Degree: FC = () => {
  const { data: session } = useSession()
  const [data, setData] = useState<DegreeTableColumns[]>([])
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
          grade: '',
          course: courseInfo.code,
          name: courseInfo.name,
          equivalent: '',
          credits: courseInfo.credits,
          color: courseInfo.color,
        })),
        ...partialCourses.map((partialCourse) => ({
          completed: false,
          term: '',
          degreeYear: partialCourse.degreeYear,
          grade: '',
          course: partialCourse.code,
          name: partialCourse.name,
          equivalent: '',
          credits: partialCourse.credits,
        })),
      ].sort((a, b) => a.degreeYear - b.degreeYear)
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
          grade: '',
          course: joinedSubjectName,
          name: '',
          equivalent: '',
          credits,
        })
      }
      subjectRequirementsArray.sort((a, b) => a.degreeYear - b.degreeYear)
      setData([...coursesArray, ...subjectRequirementsArray])
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
                      className="border border-gray-200 py-1 px-3"
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border border-gray-200">
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
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
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
      </div>
    )

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingOrError error={error?.message} />
    </div>
  )

  // const [courseModalData, setCourseModalData] = useState<FullCourseInfo | null>(
  //   null
  // )

  // if (!isLoading && degree) {
  //   return (
  //     <div className="p-4 pt-16">
  //       <DegreeDetails
  //         degree={degree}
  //         setCourseModalData={setCourseModalData}
  //       />
  //       {courseModalData && (
  //         <Modal handleClose={() => setCourseModalData(null)}>
  //           <Suspense fallback={<LoadingOrError />}>
  //             <CourseDetails courseInfo={courseModalData} />
  //           </Suspense>
  //         </Modal>
  //       )}
  //     </div>
  //   )
  // }
}

export default Degree
