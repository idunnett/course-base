import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import ProfileForm from '../../components/user/ProfileForm'

const Profile = () => {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6 pt-16">
      <Link href="/" className="flex items-center text-sm text-slate-500">
        <IoIosArrowBack />
        Dashboard
      </Link>
      <ProfileForm />
    </div>
  )
}

export default Profile
