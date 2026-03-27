
import React from 'react'
import EditProfile from '../components/EditProfile'
import { useSelector } from 'react-redux'
import useDocumentTitle from '../hooks/useDocumentTitle';

const Profile = () => {
  const user = useSelector((store) => store.user);
  useDocumentTitle(user ? `${user.firstName}'s Studio` : "My Studio");
  return (
    <div>
      {user && <EditProfile user={user} />}
    </div>
  )
}

export default Profile