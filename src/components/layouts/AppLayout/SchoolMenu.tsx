import type { FC } from 'react'
import Link from 'next/link'
import type { School } from '@prisma/client'
import { RiLoader5Line } from 'react-icons/ri'
import { useRouter } from 'next/router'

interface Props {
  school?: School | null
  isFetching?: boolean
}

const SchoolMenu: FC<Props> = ({ school, isFetching }) => {
  const router = useRouter()
  if (school || isFetching)
    return (
      <button
        onClick={() => school && router.push(`/schools/${school.id}`)}
        className="primary-btn flex items-center text-sm font-medium shadow-sm hover:shadow-md"
        style={{
          backgroundColor: school?.color,
          color: school?.secondaryColor,
        }}
      >
        {!!school ? (
          school.shortName ?? 'My school'
        ) : (
          <RiLoader5Line className="h-4 w-20 animate-spin" />
        )}
      </button>
    )

  return (
    <Link
      href="/schools"
      className="primary-btn flex items-center gap-1 font-medium"
    >
      Add School
    </Link>
  )
}

export default SchoolMenu
