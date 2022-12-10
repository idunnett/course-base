import { useSetAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { type ReactNode, useEffect } from 'react'
import { schoolAtom, toRouteAtom } from '../../atoms'
import { publicPaths } from '../../constants'
import AppLayout from './AppLayout'
import BasicLayout from './BasicLayout'

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession()
  const router = useRouter()
  const setToRoute = useSetAtom(toRouteAtom)
  const setSchool = useSetAtom(schoolAtom)

  useEffect(() => {
    if (
      session.status === 'unauthenticated' &&
      !publicPaths.includes(router.pathname)
    ) {
      console.log(router.pathname)
      setSchool(null)
      setToRoute(router.pathname)
      router.replace('/auth/signin')
    }
  }, [session])

  if (session.status === 'unauthenticated')
    return <BasicLayout>{children}</BasicLayout>

  return <AppLayout>{children}</AppLayout>
}

export default Layout
