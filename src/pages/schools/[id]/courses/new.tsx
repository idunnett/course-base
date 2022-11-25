import { useRouter } from 'next/router'
import NewCourseForm from '../../../../components/course/NewCourseForm'
import { trpc } from '../../../../utils/trpc'

const SchoolCourseCreate = () => {
  const { id } = useRouter().query

  const { data: school } = trpc.school.findById.useQuery(id as string, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  })

  return <NewCourseForm school={school ?? null} />
}

export default SchoolCourseCreate
