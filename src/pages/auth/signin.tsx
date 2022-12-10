import { useAtomValue } from 'jotai'
import type { GetServerSidePropsContext } from 'next'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type FormEvent, useRef } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { toRouteAtom } from '../../atoms'
import InputSegment from '../../components/common/InputSegment'
import Widget from '../../components/common/Widget'
import OauthButtons from '../../components/OauthButtons'

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

const SignIn = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { error } = useRouter().query
  const toRoute = useAtomValue(toRouteAtom)

  const handleSignInWithCredentials = (e: FormEvent) => {
    e.preventDefault()
    signIn('credentials', {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      callbackUrl: toRoute ?? '/',
    })
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6">
      {error && error === 'CredentialsSignin' && (
        <p className="rounded-md bg-red-400 px-2 py-1 text-white">
          Invalid Credentials
        </p>
      )}
      <Link href="/" className="flex items-center text-slate-500">
        <IoIosArrowBack />
        Return to home page
      </Link>
      <Widget className="w-11/12 rounded-2xl p-6 shadow-sm sm:w-4/5 md:w-3/5 lg:w-2/5">
        <h1 className="text-3xl font-bold text-slate-500 dark:text-neutral-200">
          Sign In
        </h1>
        <OauthButtons />
        <form onSubmit={handleSignInWithCredentials} className="flex flex-col">
          <div className="flex flex-col">
            <InputSegment
              name="email"
              label="Email"
              ref={emailRef}
              type="email"
              autoFocus={true}
            />
            <InputSegment
              name="password"
              label="Password"
              ref={passwordRef}
              type="password"
            />
          </div>
          <button
            type="submit"
            className="primary-btn mt-3 self-center px-8 py-2 text-xl transition-all duration-200 ease-linear"
          >
            Go
          </button>
        </form>
      </Widget>
      <p className="text-gray-900 dark:text-neutral-400">
        {"Don't have an account? "}
        <Link href="/auth/signup" className="text-link" shallow>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default SignIn
