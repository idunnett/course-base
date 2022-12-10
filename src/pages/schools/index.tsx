import { type FormEvent, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import Form from '../../components/common/Form'
import { useSetAtom } from 'jotai'
import { schoolAtom } from '../../atoms'
import SchoolAutoComplete from '../../components/school/SchoolAutoComplete'
import { useRouter } from 'next/router'
import type { School } from '@prisma/client'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'

const SchoolSearch = () => {
  const router = useRouter()
  const [school, setSchool] = useState<School | null>(null)
  const setSchoolAtom = useSetAtom(schoolAtom)

  const { mutate: joinSchool, isLoading: isJoining } =
    trpc.school.join.useMutation({
      onSuccess: (data) => {
        setSchoolAtom(data)
        router.replace(`/schools/${data.id}`)
      },
      onError: (error) => alert(error.message),
    })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!!!school) return
    joinSchool(school.id)
  }

  return (
    <div className="flex h-screen w-full items-center justify-evenly">
      <Form
        title="Find your school"
        handleSubmit={handleSubmit}
        className="w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5"
      >
        <SchoolAutoComplete
          onSelect={(school: School) => setSchool(school)}
          school={school}
          onShowInputField={() => setSchool(null)}
        />
        <div className="flex items-center gap-6">
          <button
            type="submit"
            className={
              'primary-btn self-center px-8 py-2 text-xl transition-all duration-200 ease-linear ' +
              (!isJoining && !!school
                ? '-translate-y-1 shadow-custom-lg'
                : 'cursor-not-allowed opacity-75 hover:bg-slate-500')
            }
            disabled={isJoining || !!!school}
          >
            {isJoining ? (
              <FaSpinner className="h-7 animate-spin dark:text-neutral-200" />
            ) : (
              'Join'
            )}
          </button>
          <Link href="/schools/new" className="text-sm text-slate-500">
            Create new
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default SchoolSearch
