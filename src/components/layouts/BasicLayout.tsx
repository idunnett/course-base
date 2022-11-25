import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import NavHeader from '../common/NavHeader'
import { signIn } from 'next-auth/react'

const BasicLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  return (
    <div className="relative h-full w-full overflow-auto">
      <NavHeader>
        <div className="flex items-center gap-4">
          {router.pathname !== '/auth/signin' && (
            <button className="secondary-btn" onClick={() => signIn()}>
              Sign In
            </button>
          )}
          {router.pathname !== '/auth/signup' && (
            <Link href="/auth/signup" className="primary-btn shadow-lg">
              Sign Up
            </Link>
          )}
        </div>
      </NavHeader>
      {children}
    </div>
  )
}

export default BasicLayout
