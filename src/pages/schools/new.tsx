import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { type FormEvent, useRef, useState } from 'react'
import { RiLoader5Line } from 'react-icons/ri'
import { schoolAtom } from '../../atoms'
import ColorPicker from '../../components/common/ColorPicker'
import Form from '../../components/common/Form'
import InputSegment from '../../components/common/InputSegment'
import { trpc } from '../../utils/trpc'

const SchoolCreate = () => {
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const shortNameRef = useRef<HTMLInputElement>(null)

  const setSchoolAtom = useSetAtom(schoolAtom)
  const [primaryColor, setPrimaryColor] = useState('')
  const [secondaryColor, setSecondaryColor] = useState('')

  const { mutate: createSchool, isLoading } = trpc.school.create.useMutation({
    onSuccess: (data) => {
      setSchoolAtom(data)
      router.replace(`/schools/${data.id}`)
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!nameRef.current?.value || !shortNameRef.current?.value)
      return alert('Name and Short are required.')

    const newSchool = {
      name: nameRef.current.value,
      shortName: shortNameRef.current.value,
      color: primaryColor,
      secondaryColor,
    }
    createSchool(newSchool)
  }

  return (
    <div className="flex w-full justify-center pt-16">
      <div
        className="absolute top-0 left-0 z-0 h-full w-full"
        style={{
          backgroundImage: `linear-gradient(to right, ${
            primaryColor || secondaryColor
          } 50%, ${secondaryColor || primaryColor} 50%)`,
        }}
      ></div>
      <Form
        title="Create School"
        handleSubmit={handleSubmit}
        className="z-10 w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5"
      >
        <InputSegment
          label="Name"
          ref={nameRef}
          autoComplete={false}
          autoFocus
        />
        <InputSegment label="Short" ref={shortNameRef} autoComplete={false} />
        <div className="flex w-full justify-evenly">
          <ColorPicker
            color={primaryColor}
            setColor={setPrimaryColor}
            label="Primary Color"
          />
          <ColorPicker
            color={secondaryColor}
            setColor={setSecondaryColor}
            label="Secondary Color"
          />
        </div>
        <button
          type="submit"
          className={
            'primary-btn mt-3 self-center text-lg transition-all duration-200 ease-linear ' +
            (!isLoading
              ? '-translate-y-1 shadow-custom-lg'
              : 'cursor-not-allowed opacity-75')
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <RiLoader5Line className="h-7 animate-spin dark:text-neutral-200" />
          ) : (
            'Create and join'
          )}
        </button>
      </Form>
    </div>
  )
}

export default SchoolCreate
