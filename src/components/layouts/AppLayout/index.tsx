import Link from 'next/link'
import { type FC, type ReactNode, useEffect } from 'react'
import NavHeader from '../../common/NavHeader'
import UserMenu from './UserMenu'
import SchoolMenu from './SchoolMenu'
import { trpc } from '../../../utils/trpc'
import { signOut, useSession } from 'next-auth/react'
import PageLoading from '../PageLoading'
import { useAtom } from 'jotai'
import { alertAtom, userSchoolAtom } from '../../../atoms'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
}

const AppLayout: FC<Props> = ({ children }) => {
  const { data: session } = useSession()
  const [userSchool, setUserSchool] = useAtom(userSchoolAtom)
  const [alert, setAlert] = useAtom(alertAtom)

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

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }
  }, [alert, setAlert])

  function getAlertColor(type: string) {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-white dark:bg-zinc-800">
      {alert && (
        <div className="fixed top-14 z-50 flex w-screen animate-pop-in justify-center">
          <span
            className={`rounded-md py-0.5 px-2 text-sm ${getAlertColor(
              alert.type
            )}`}
          >
            {alert.message}
          </span>
        </div>
      )}
      <NavHeader>
        {isFetching ? (
          <div className="skeleton-loading-text mr-2 w-24 bg-slate-500" />
        ) : (
          <>
            {user?.degreeName ? (
              <Link
                href="/my/degree"
                className="secondary-btn flex items-center px-3 text-sm font-normal text-slate-500 dark:hover:bg-zinc-700"
              >
                My Degree
              </Link>
            ) : (
              <Link
                href="/degrees"
                className="secondary-btn text-sm font-normal text-slate-500 dark:hover:bg-zinc-700"
              >
                Add my degree
              </Link>
            )}
          </>
        )}
        <div className="ml-3 flex items-center gap-4">
          <SchoolMenu school={userSchool} isFetching={isFetching} />
          <UserMenu />
        </div>
      </NavHeader>
      <div className="relative z-10 flex min-h-0 w-full grow">
        <Sidebar />
        <section
          id="page-section"
          className="w-full flex-auto grow overflow-auto"
        >
          <PageLoading />
          {children}
        </section>
      </div>
    </div>
  )
}

export default AppLayout
