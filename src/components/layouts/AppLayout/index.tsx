import Link from 'next/link'
import { type FC, type ReactNode, useEffect } from 'react'
import NavHeader from '../../common/NavHeader'
import UserMenu from './UserMenu'
import SchoolMenu from './SchoolMenu'
import { trpc } from '../../../utils/trpc'
import { signOut, useSession } from 'next-auth/react'
import PageLoading from '../PageLoading'
import { useAtom } from 'jotai'
import { userSchoolAtom } from '../../../atoms'

interface Props {
  children: ReactNode
}

const AppLayout: FC<Props> = ({ children }) => {
  const { data: session } = useSession()
  const [userSchool, setUserSchool] = useAtom(userSchoolAtom)

  const { data: user, isFetching } = trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!session?.user?.id,
    onSuccess: (data) => {
      setUserSchool(data.school)
    },
    onError: () => {
      setUserSchool(null)
      signOut()
    },
  })

  useEffect(() => {
    // Whenever the user explicitly chooses dark mode
    if (localStorage.darkMode && JSON.parse(localStorage.darkMode)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  return (
    <div className="relative h-full w-full overflow-auto">
      <NavHeader>
        {isFetching ? (
          <div className="skeleton-loading-text mr-2 w-24 bg-slate-500" />
        ) : (
          <Link
            href="/my/degree"
            className="secondary-btn font-normal text-slate-500"
          >
            {user?.degreeName || 'My Degree'}
          </Link>
        )}
        <div className="ml-3 flex items-center gap-4">
          <SchoolMenu school={userSchool} isFetching={isFetching} />
          <UserMenu />
        </div>
      </NavHeader>
      <div className="relative h-full w-full">
        <PageLoading />
        {children}
      </div>
    </div>
  )
}

export default AppLayout
