import { useAtomValue } from 'jotai'
import { userSchoolAtom } from '../../atoms'
import NewDegreeForm from '../../components/degree/NewDegreeForm'

const DegreeCreate = () => {
  const school = useAtomValue(userSchoolAtom)
  return <NewDegreeForm school={school} />
}

export default DegreeCreate
