import type { School } from '@prisma/client'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import Form from '../../components/common/Form'
import InputSegment from '../../components/common/InputSegment'
import LoadingOrError from '../../components/common/LoadingOrError'
import Modal from '../../components/common/Modal'
import DegreeButton from '../../components/degree/DegreeButton'
import SchoolAutoComplete from '../../components/school/SchoolAutoComplete'
import useDebounce from '../../hooks/useDebounce'
import type { FullCourseInfo } from '../../types'
import { trpc } from '../../utils/trpc'

const DegreeDetails = dynamic(
  () => import('../../components/degree/DegreeDetails')
)
const CourseDetails = dynamic(
  () => import('../../components/course/CourseDetails')
)

const Degrees = () => {
  const { data: session } = useSession()
  const [school, setSchool] = useState<School | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [activeDegreeId, setActiveDegreeId] = useState<string | null>(null)
  const [courseModalData, setCourseModalData] = useState<FullCourseInfo | null>(
    null
  )
  const debouncedNameInput = useDebounce(nameInput, 500)

  const {
    data: degrees,
    isFetching,
    error,
  } = trpc.degree.search.useQuery(
    { searchVal: debouncedNameInput },
    {
      queryKey: ['degree.search', debouncedNameInput],
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )

  const {
    data: activeDegree,
    isLoading,
    error: activeDegreeError,
  } = trpc.degree.findById.useQuery(activeDegreeId as string, {
    queryKey: ['degree.findById', activeDegreeId as string],
    enabled: !!activeDegreeId,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex w-full flex-col gap-4 p-4 pt-16">
      <Form
        title="Search Degrees"
        handleSubmit={(e) => e.preventDefault()}
        className="!gap-1 !p-0"
      >
        <div className="flex items-end gap-4">
          <InputSegment
            label="Degree name"
            animate={false}
            containerClassName="!my-0"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <span className="mb-4 text-2xl text-slate-500 dark:text-neutral-200">
            @
          </span>
          <SchoolAutoComplete
            animate={false}
            school={school}
            onSelect={(s) => setSchool(s)}
            className="!w-96"
          />
        </div>
        <Link href="/degrees/new" className="secondary-btn">
          Create new
        </Link>
      </Form>
      {!isFetching && degrees?.items ? (
        <div className="flex w-full flex-col">
          {degrees.items.map((degree) => (
            <DegreeButton
              key={degree.id}
              degree={degree}
              onClick={() => setActiveDegreeId(degree.id)}
            />
          ))}
        </div>
      ) : (
        <LoadingOrError error={error?.message} />
      )}
      {activeDegreeId && (
        <Modal handleClose={() => setActiveDegreeId(null)}>
          {!isLoading && activeDegree ? (
            <Suspense fallback={<LoadingOrError />}>
              <DegreeDetails
                degree={activeDegree}
                setCourseModalData={setCourseModalData}
              />
              {session?.user?.degreeId && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    disabled={session.user.degreeId === activeDegreeId}
                    className={`primary-btn px-4 text-2xl ${
                      session.user.degreeId === activeDegreeId &&
                      'cursor-not-allowed opacity-50 hover:bg-slate-500'
                    }`}
                  >
                    Join
                  </button>
                  {session.user.degreeId === activeDegreeId && (
                    <p className="text-sm text-slate-400 dark:text-white">
                      You are already pursuing this degree.
                    </p>
                  )}
                </div>
              )}
            </Suspense>
          ) : (
            <LoadingOrError error={activeDegreeError?.message} />
          )}
        </Modal>
      )}
      {courseModalData && (
        <Modal handleClose={() => setCourseModalData(null)}>
          <Suspense fallback={<LoadingOrError />}>
            <CourseDetails courseInfo={courseModalData} />
          </Suspense>
        </Modal>
      )}
    </div>
  )
}

export default Degrees
