import Link from 'next/link'
import { ReactNode, useEffect } from 'react'
import NavHeader from '../../common/NavHeader'
import UserMenu from './UserMenu'
import SchoolMenu from './SchoolMenu'

const AppLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Whenever the user explicitly chooses dark mode
    if (JSON.parse(localStorage.darkMode)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  return (
    <div className="relative h-full w-full overflow-auto">
      <NavHeader>
        <Link href="/degrees" className="secondary-btn">
          Degrees
        </Link>
        <Link href="/courses" className="secondary-btn">
          Courses
        </Link>
        <Link href="/schools" className="secondary-btn">
          Schools
        </Link>
        <div className="ml-4 flex items-center gap-4">
          <SchoolMenu />
          <UserMenu />
        </div>
      </NavHeader>
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}

export default AppLayout
