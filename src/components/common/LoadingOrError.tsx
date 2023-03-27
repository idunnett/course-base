import { RiLoader5Line } from 'react-icons/ri'

function LoadingOrError({ error }: { error?: string }) {
  return (
    <div className="-mt-12 flex h-screen w-full items-center justify-center">
      {error ? (
        <p className="dark:text-white">{error}</p>
      ) : (
        <RiLoader5Line className="animate-spin dark:text-white" />
      )}
    </div>
  )
}

export default LoadingOrError
