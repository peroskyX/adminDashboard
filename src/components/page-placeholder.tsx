import React from 'react';
import BusinessList from './BusinessList';

export default function PagePlaceholder({ pageName }: { pageName: string }) {
  return (
    <div className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4">
      <span className="font-bold text-3xl">{pageName}</span>
      <BusinessList pageSize={30} />
    </div>
  );
}
