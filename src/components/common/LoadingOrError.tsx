import React from 'react'
import { FaSpinner } from 'react-icons/fa'

function LoadingOrError({ error }: { error?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {error ? (
        <p className="dark:text-white">{error}</p>
      ) : (
        <FaSpinner className="animate-spin dark:text-white" />
      )}
    </div>
  )
}

export default LoadingOrError
