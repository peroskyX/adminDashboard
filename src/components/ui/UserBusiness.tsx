'use client';

import { Users, Briefcase } from "lucide-react";

const UsersAndBusinessesIcon = () => {
  return (
    <div className="flex items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Users Icon */}
      <div className="flex items-center">
        <Users className="text-red-500 w-6 h-6" />
      </div>

      {/* Divider */}
      <div className="h-5 border-l border-gray-700 mx-1"></div>

      {/* Businesses Icon */}
      <div className="flex items-center">
        <Briefcase className="text-blue-500 w-6 h-6" />
      </div>
    </div>
  );
};

export default UsersAndBusinessesIcon;
