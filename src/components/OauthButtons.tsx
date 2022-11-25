import { signIn } from 'next-auth/react'
import { FaDiscord } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

interface Props {
  signUp?: boolean
}

const OauthButtons: React.FC<Props> = ({ signUp = false }) => {
  return (
    <div className="my-2 flex flex-col gap-2.5">
      <button
        className="primary-btn flex w-full max-w-none items-center justify-center gap-3 bg-white text-xl text-[#757575] hover:bg-white hover:brightness-95"
        onClick={() =>
          signIn('google', {
            callbackUrl: '/',
          })
        }
      >
        <FcGoogle className="h-8 w-8" />
        Sign {signUp ? 'up' : 'in'} with Google
      </button>
      <button
        className="primary-btn flex w-full max-w-none items-center justify-center gap-3 bg-[#7388DA] text-xl hover:bg-[#7388DA] hover:brightness-95"
        onClick={() =>
          signIn('discord', {
            callbackUrl: '/',
          })
        }
      >
        <FaDiscord className="h-8 w-8" />
        Sign {signUp ? 'up' : 'in'} with Discord
      </button>
    </div>
  )
}

export default OauthButtons
