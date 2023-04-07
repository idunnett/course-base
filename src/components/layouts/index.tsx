import { useSetAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { type ReactNode, useEffect } from 'react'
import { toRouteAtom, userSchoolAtom } from '../../atoms'
import { publicPaths } from '../../constants'
import AppLayout from './AppLayout'
import BasicLayout from './BasicLayout'

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession()
  const router = useRouter()
  const setToRoute = useSetAtom(toRouteAtom)
  const setUserSchool = useSetAtom(userSchoolAtom)

  useEffect(() => {
    if (
      session.status === 'unauthenticated' &&
      !publicPaths.includes(router.pathname)
    ) {
      setUserSchool(null)
      setToRoute(router.asPath)
      router.replace('/auth/signin')
    }
  }, [router, session, setToRoute, setUserSchool])

  if (session.status === 'unauthenticated' || session.status === 'loading')
    return <BasicLayout>{children}</BasicLayout>

  return <AppLayout>{children}</AppLayout>
}

export default Layout
