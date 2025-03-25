"use client";

import React from 'react';
import ProfileList from '@/components/ProfileList';

export default function UsersPage() {
  return (
    <div className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4">
      <span className="font-bold text-3xl">Users List</span>
      <ProfileList pageSize={90} />
    </div>
  );
}
