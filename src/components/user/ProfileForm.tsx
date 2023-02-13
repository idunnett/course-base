import { useEffect } from 'react'
import { FaUserGraduate } from 'react-icons/fa'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useAtom } from 'jotai'
import Form from '../common/Form'
import { darkModeAtom } from '../../atoms'
import SchoolButton from '../school/SchoolButton'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import LoadingOrError from '../common/LoadingOrError'
import { RiLoader5Line, RiBuilding2Line } from 'react-icons/ri'

const ProfileForm = () => {
  const session = useSession()
  const router = useRouter()
  const { id } = router.query
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)

  const {
    data: user,
    isLoading,
    error,
  } = trpc.user.findById.useQuery(id as string, {
    enabled: !!id,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setDarkMode(data.darkMode)
    },
  })
  const { data: school } = trpc.school.findById.useQuery(
    user?.schoolId as string,
    {
      enabled: !!user?.schoolId,
      refetchOnWindowFocus: false,
    }
  )
  const { mutate: changeDarkMode, isLoading: isChangingDarkMode } =
    trpc.user.setDarkMode.useMutation({
      onError: (error) => {
        setDarkMode((prevState) => !prevState)
        alert(error.message)
      },
    })

  useEffect(() => {
    if (user) {
      if (darkMode) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (user) setDarkMode(user?.darkMode ?? false)
  }, [user])

  const toggleDarkMode = () => {
    changeDarkMode(!darkMode)
    setDarkMode((prevState) => !prevState)
  }

  if (!isLoading && user)
    return (
      <Form title="Profile" className="w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5">
        <div className="flex items-center gap-6 text-slate-500 dark:text-white">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'Profile image'}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <FaUserGraduate className="h-5 w-5 text-slate-500 dark:text-neutral-400" />
          )}
          <h2 className="text-3xl font-medium text-slate-600 dark:text-white">
            {user.name}
          </h2>
        </div>
        {id === session.data?.user?.id && (
          <div className="flex h-auto flex-col-reverse gap-1">
            <p
              id="email"
              className="h-full w-full rounded-xl bg-transparent py-3 text-2xl text-slate-600 dark:text-white"
            >
              {user?.email}
            </p>
            <label
              htmlFor="email"
              className="h-5 text-slate-500 dark:text-neutral-400"
            >
              Email
            </label>
          </div>
        )}
        <div className="flex h-auto flex-col-reverse gap-1">
          {school ? (
            <SchoolButton
              school={school}
              onClick={() => router.push('/schools')}
              disabled={id !== session.data?.user?.id}
              className={`
                ${
                  id !== session.data?.user?.id &&
                  'cursor-default bg-opacity-0 shadow-none hover:bg-opacity-0'
                }`}
            />
          ) : (
            <RiLoader5Line className="h-full animate-spin py-3 text-slate-400 dark:text-neutral-200" />
          )}
          <div className="flex items-center justify-between">
            <label
              htmlFor="school"
              className="flex h-5 items-center gap-2 text-slate-500 dark:text-neutral-400"
            >
              <RiBuilding2Line />
              School
            </label>
          </div>
        </div>
        {id === session.data?.user?.id && (
          <div className="flex h-auto flex-col-reverse gap-1">
            <input
              className="peer opacity-0"
              type="checkbox"
              id="theme"
              name="theme"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <label
              htmlFor="theme"
              className="relative mt-1 h-12 w-20 cursor-pointer rounded-full border border-transparent bg-gray-300 dark:bg-zinc-600"
              style={{
                height: '2.75rem',
              }}
            >
              <i
                className="absolute top-1/2 mx-1 h-8 w-8 -translate-y-1/2 rounded-full transition-all duration-300 ease-in-out"
                style={{
                  left: darkMode ? '2.35rem' : 0,
                  backgroundColor: darkMode
                    ? 'rgb(91, 33, 182)'
                    : 'rgb(245, 158, 11)',
                }}
              ></i>
              <FiSun className="absolute left-0 top-1/2 mx-3 -translate-y-1/2 text-white" />
              <FiMoon className="absolute right-0 top-1/2 mx-3 -translate-y-1/2 text-white" />
              {isChangingDarkMode && (
                <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2">
                  <RiLoader5Line className="animate-spin text-xs dark:text-white" />
                </div>
              )}
            </label>
            <span className="h-5 text-slate-500 dark:text-neutral-400">
              Theme
            </span>
          </div>
        )}
      </Form>
    )

  return <LoadingOrError error={error?.message} />
}

export default ProfileForm
