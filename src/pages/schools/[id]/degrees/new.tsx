import { useRouter } from 'next/router'
import NewDegreeForm from '../../../../components/degree/NewDegreeForm'
import { trpc } from '../../../../utils/trpc'

const SchoolDegreeCreate = () => {
  const { id } = useRouter().query

  const { data: school } = trpc.school.findById.useQuery(id as string, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  })

  return <NewDegreeForm school={school ?? null} />
}

export default SchoolDegreeCreate
