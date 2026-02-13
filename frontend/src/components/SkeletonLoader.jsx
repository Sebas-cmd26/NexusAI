import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="glass-card h-full flex flex-col overflow-hidden animate-pulse">
        <div className="h-56 bg-white/5" />
        <div className="p-6 space-y-4">
          <div className="h-3 bg-white/5 rounded-full w-1/4" />
          <div className="h-6 bg-white/5 rounded-full w-3/4" />
          <div className="h-6 bg-white/5 rounded-full w-1/2" />
          <div className="pt-4">
            <div className="h-20 bg-white/5 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-white/5 rounded-full w-3/4" />
      <div className="h-4 bg-white/5 rounded-full w-full" />
      <div className="h-4 bg-white/5 rounded-full w-2/3" />
    </div>
  );
};

export default SkeletonLoader;
