import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import Card from '../components/Card'

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(!feed);

  const getFeed = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true
      })
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!feed || feed.length === 0) {
      getFeed();
    } else {
      setLoading(false);
    }
  }, [])

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fadeIn'>
        <div className="card bg-base-300 w-full max-w-[380px] h-[600px] shadow-sm animate-pulse rounded-2xl flex flex-col overflow-hidden border border-base-200">
          <div className="bg-base-200 h-2/3 w-full"></div>
          <div className="p-10 space-y-6">
            <div className="h-8 bg-base-200 rounded-full w-3/4"></div>
            <div className="h-4 bg-base-200 rounded-full w-1/2"></div>
            <div className="space-y-4 pt-8">
              <div className="h-14 bg-base-200 rounded-xl"></div>
              <div className="h-14 bg-base-200 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-40">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-bold tracking-widest uppercase text-xs">Curating Your Feed</p>
        </div>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center group'>
        <div className="mb-8 p-10 rounded-full bg-base-300 transform transition-transform group-hover:scale-110 duration-500 shadow-xl border border-base-200">
          <span className="text-7xl" role="img" aria-label="Coffee cup icon">☕</span>
        </div>
        <h2 className='text-3xl md:text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>
          That's a wrap!
        </h2>
        <p className='text-lg md:text-xl opacity-60 max-w-sm leading-relaxed'>
          You've seen everyone around you for now. Take a break, grab a coffee, and check back later for new developers!
        </p>
        <button
          onClick={getFeed}
          className="btn btn-primary btn-outline btn-lg mt-10 rounded-full border-2 hover:scale-105 transition-all shadow-xl px-12"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center my-10 px-4 animate-slideIn'>
      <div className='relative group'>
        <Card user={feed[0]} />
        {/* Visual Hint for multiple cards */}
        {feed.length > 1 && (
          <div className="absolute -bottom-4 -z-10 w-[95%] left-1/2 -translate-x-1/2 h-10 bg-base-300 rounded-2xl opacity-40 border border-base-200 shadow-xl transition-transform group-hover:translate-y-2"></div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 opacity-30 text-xs font-black uppercase tracking-[0.2em]">
        <span className="h-px w-8 bg-current"></span>
        <span>{feed.length} dev discoveries remaining</span>
        <span className="h-px w-8 bg-current"></span>
      </div>
    </div>
  )
}

export default Feed;