import { useSession } from 'next-auth/react'
import { Suspense, useState } from 'react'
import LoadingOrError from '../../components/common/LoadingOrError'
import Modal from '../../components/common/Modal'
import Widget from '../../components/common/Widget'
import CourseDetails from '../../components/course/CourseDetails'
import DegreeDetails from '../../components/degree/DegreeDetails'
import type { FullCourse } from '../../types'
import { trpc } from '../../utils/trpc'

const degree = () => {
  const { data: session } = useSession()
  const [courseModalData, setCourseModalData] = useState<FullCourse | null>(
    null
  )

  const {
    data: degree,
    isLoading,
    error,
  } = trpc.degree.findById.useQuery(session?.user?.degreeId as string, {
    enabled: !!session?.user?.degreeId,
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (!isLoading && degree) {
    return (
      <div className="p-4 pt-16">
        <Widget>
          <DegreeDetails
            degree={degree}
            setCourseModalData={setCourseModalData}
          />
        </Widget>
        {courseModalData && (
          <Modal handleClose={() => setCourseModalData(null)}>
            <Suspense fallback={<LoadingOrError />}>
              <CourseDetails course={courseModalData} />
            </Suspense>
          </Modal>
        )}
      </div>
    )
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingOrError error={error?.message} />
    </div>
  )
}

export default degree
