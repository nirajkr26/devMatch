import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import Card from '../components/Card'

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true
      })
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getFeed();
  }, [])

  if (!feed) return;

  if (feed.length < 1) return <p className='text-3xl text-center'>No new users currently</p>
  return (
    feed && (
      <div className='flex justify-center my-10'>
        <Card user={feed[0]} />
      </div>
    )
  )
}

export default Feed