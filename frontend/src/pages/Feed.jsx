import React from 'react';
import Card from '../components/Card';
import { useFeed, FeedLoadingState, FeedEmptyState } from '../features/feed';

const Feed = () => {
  const { feed, isLoading, refetch } = useFeed();

  if (isLoading) {
    return <FeedLoadingState />;
  }

  if (!feed || feed.length === 0) {
    return <FeedEmptyState onRefetch={() => refetch()} />;
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