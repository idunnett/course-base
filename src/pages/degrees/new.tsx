import type { School } from '@prisma/client'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { schoolAtom } from '../../atoms'
import NewDegreeForm from '../../components/degree/NewDegreeForm'

const DegreeCreate = () => {
  const currentSchool = useAtomValue(schoolAtom)
  const [school, setSchool] = useState<School | null>(null)

  // To avoid hydration issues
  useEffect(() => {
    setSchool(currentSchool)
  }, [])

  return <NewDegreeForm school={school} />
}

export default DegreeCreate
