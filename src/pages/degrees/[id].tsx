import { useRouter } from 'next/router'
import { Suspense, useState } from 'react'
import LoadingOrError from '../../components/common/LoadingOrError'
import Modal from '../../components/common/Modal'
import Widget from '../../components/common/Widget'
import CourseDetails from '../../components/course/CourseDetails'
import DegreeDetails from '../../components/degree/DegreeDetails'
import type { FullCourseInfo } from '../../types'
import { trpc } from '../../utils/trpc'

const DegreeView = () => {
  const { id } = useRouter().query
  const [courseModalData, setCourseModalData] = useState<FullCourseInfo | null>(
    null
  )

  const {
    data: degree,
    isLoading,
    error,
  } = trpc.degree.findById.useQuery(id as string, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
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
              <CourseDetails courseInfo={courseModalData} />
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

export default DegreeView
