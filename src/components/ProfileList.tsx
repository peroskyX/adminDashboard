"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfiles } from "@/lib/firestoreClient"; // Only fetchProfiles is needed now
import { DataTable } from "@/components/DataTable";
import { Button } from "./ui/profileButton";
import { format } from "date-fns";

interface Profile {
  id: string;
  fullName: string;
  email: string;
  createdAt: any; 
  activeCoins: number;
}

interface ProfileListProps {
  pageSize?: number;
}

export default function ProfileList({ pageSize = 10 }: ProfileListProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [previousStack, setPreviousStack] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async (nextPage = false) => {
    setLoading(true);
    try {
      const data = await fetchProfiles(pageSize, nextPage ? lastVisible : undefined);
      //@ts-ignore
      setProfiles(data.users); // Updated to use 'users' from fetchProfiles
      setLastVisible(data.lastVisible);
      //@ts-ignore
      setIsNextAvailable(data.users.length === pageSize); // Updated to use 'users'

      if (nextPage) {
        setPreviousStack((prev) => [...prev, lastVisible]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (previousStack.length > 0) {
      const prevLastVisible = previousStack[previousStack.length - 1];
      setPreviousStack((prev) => prev.slice(0, -1));
      setLastVisible(prevLastVisible);
      loadProfiles();
    }
  };

  const handleNext = () => {
    loadProfiles(true);
  };

  const handleProfileClick = (profile: Profile) => {
    router.push(`/admin/useractivities/${profile.id}`);
  };

  // Helper function to format Firestore timestamp
  const formatDate = (timestamp: any) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
      return date.toLocaleDateString(); // Format as date (you can use other methods to customize)
    }
    return 'Invalid date'; // In case the timestamp is invalid
  };

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <DataTable
          columns={[
            { accessorKey: "fullName", header: "Full Name" },
            { accessorKey: "email", header: "Email" },
            // { accessorKey: "createdAt", header: "Created At" },
            // { accessorKey: "activeCoins", header: "Active Coins" },
          ]}
          data={profiles}
          onRowClick={handleProfileClick}
        />
      </div>

      <div className="md:hidden">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white p-4 mb-4 border rounded shadow-md"
            onClick={() => handleProfileClick(profile)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="font-bold text-xl">{profile.fullName}</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            {/* <p><strong>Created At:</strong> {new Date(profile.createdAt.toDate()).toLocaleDateString()}</p>
            <p><strong>Active Coins:</strong> {profile.activeCoins}</p> */}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={handlePrevious} variant="outline" size="sm" disabled={previousStack.length === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} variant="outline" size="sm" disabled={!isNextAvailable}>
          Next
        </Button>
      </div>
    </div>
  );
}
