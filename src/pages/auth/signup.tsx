import type { GetServerSidePropsContext } from 'next'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { RiLoader5Line } from 'react-icons/ri'
import InputSegment from '../../components/common/InputSegment'
import Widget from '../../components/common/Widget'
import OauthButtons from '../../components/OauthButtons'
import { trpc } from '../../utils/trpc'

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx)
  if (session)
    return {
      redirect: { destination: '/' },
      props: {},
    }
  return {
    props: {},
  }
}

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {
    mutate: signUp,
    error,
    isLoading,
  } = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/',
      })
    },
  })

  const handleSignUpWithCredentials = (e: FormEvent) => {
    e.preventDefault()
    signUp({
      username,
      email,
      password,
    })
  }

  return (
    <div className="-mt-12 flex h-screen w-full flex-col items-center justify-center gap-6">
      {error && (
        <p className="rounded-md bg-red-400 px-2 py-1 text-white">
          {error.message}
        </p>
      )}
      <Link href="/" className="flex items-center text-slate-500">
        <IoIosArrowBack />
        Return to home page
      </Link>
      <Widget className="w-11/12 rounded-2xl p-6 shadow-sm sm:w-4/5 md:w-3/5 lg:w-2/5">
        <h1 className="text-3xl font-bold text-slate-500 dark:text-neutral-200">
          Sign Up
        </h1>
        <OauthButtons signUp />
        <form onSubmit={handleSignUpWithCredentials} className="flex flex-col">
          <div className="flex flex-col">
            <InputSegment
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus={true}
            />
            <InputSegment
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <InputSegment
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <button
            type="submit"
            className={`primary-btn mt-3 self-center px-8 py-2 text-xl transition-all duration-200 ease-linear ${
              !isLoading
                ? '-translate-y-1 shadow-custom-lg'
                : 'cursor-not-allowed'
            }`}
          >
            {isLoading ? <RiLoader5Line className="animate-spin" /> : 'Go'}
          </button>
        </form>
      </Widget>
      <p className="text-gray-900 dark:text-neutral-400">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-link" shallow>
          Sign In
        </Link>
      </p>
    </div>
  )
}

export default SignUp
