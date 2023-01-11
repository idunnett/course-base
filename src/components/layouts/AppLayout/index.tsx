import Link from 'next/link'
import { type FC, type ReactNode, useEffect, useState } from 'react'
import NavHeader from '../../common/NavHeader'
import UserMenu from './UserMenu'
import SchoolMenu from './SchoolMenu'
import { trpc } from '../../../utils/trpc'
import { signOut, useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { userAtom } from '../../../atoms'
import type { School, User } from '@prisma/client'

interface Props {
  children: ReactNode
}

const AppLayout: FC<Props> = ({ children }) => {
  const { data: session } = useSession()
  const [userAtomState, setUserAtomState] = useAtom(userAtom)
  const [user, setUser] = useState<
    | (Omit<User, 'password' | 'courseIds'> & {
        school?: Omit<School, 'name' | 'memberCount'> | null
        degreeName?: string
      })
    | null
  >(null)

  const { isFetching } = trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!session?.user?.id && !userAtomState,
    onSuccess: (data) => {
      setUser(data)
      setUserAtomState(data)
    },
    onError: () => {
      setUser(null)
      setUserAtomState(null)
      signOut()
    },
  })

  useEffect(() => {
    // to avoid hydration mismatch
    if (userAtomState) {
      setUser(userAtomState)
    }
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
          <Link href="/my/degree" className="secondary-btn text-slate-600">
            {user?.degreeName || 'My Degree'}
          </Link>
        )}
        <span className="text-slate-400 dark:text-neutral-400">@</span>
        <div className="ml-3 flex items-center gap-4">
          <SchoolMenu school={user?.school} isFetching={isFetching} />
          <UserMenu />
        </div>
      </NavHeader>
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}

export default AppLayout
