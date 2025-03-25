"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const activityTypes = {
  REGISTRATION: 100,
  RELOGIN: 101,
  RESET_PASSWORD: 102,
  PERFORM_SEARCH_TEXT: 200,
  PERFORM_SEARCH_VOICE: 201,
  PROFILE_PICS_UPDATE: 300,
  PROFILE_INFO_UPDATE: 301,
  PROFILE_LOGOUT: 302,
  REFERRAL_CODE_GENERATED: 400,
  REFERRAL_CODE_APPLIED: 401,
  REFERRAL_CODE_SHARE_TAPPED: 402,
  COIN_NEW_MILESTONE: 500,
  COIN_ADDITION: 501,
  COIN_REMOVAL: 502,
  CLAIM_DISCOUNT: 601,
  SELLER_INTERESTED: 701,
  SELLER_APPLICATION: 702,
  USER_CHAT_VOICE_TO_TEXT: 801,
  WANTS_TO_PAY: 901,
};

const UserActivitiesPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [activityCount, setActivityCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 User ID from URL:", userId);
  }, [userId]);

  const fetchActivityData = async (activityName: string, activityType: number) => {
    console.log(`🖱️ Clicked: ${activityName} (${activityType})`);

    if (!userId) {
      console.error("❌ No user ID found!");
      return;
    }

    setSelectedActivity(activityName);
    setLoading(true);
    setError(null);

    try {
      const url = `https://us-central1-your-project-id.cloudfunctions.net/getUserActivityCount?userId=${userId}&activityType=${activityType}`;
      console.log("🌐 Fetching:", url);

      const response = await fetch(url);
      console.log("🔍 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("📊 API Response Data:", result);

      setActivityCount(result.count ?? 0);
    } catch (error) {
      setError("Error fetching activity data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">User Activities</h1>
      <p className="text-gray-500">User ID: {userId ?? "Not Found"}</p>

      {/* Buttons to select activity type */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {Object.entries(activityTypes).map(([key, value]) => (
          <button
            key={key}
            onClick={() => {
              console.log(`🖱️ Button Clicked: ${key}`);
              fetchActivityData(key, value);
            }}
            className={`px-4 py-2 rounded text-white ${
              selectedActivity === key ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-600`}
          >
            {key} ({value})
          </button>
        ))}
      </div>

      {/* Display activity details */}
      {selectedActivity && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Activity Details: {selectedActivity}</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : activityCount !== null ? (
            <p className="text-lg font-medium">
              This user has performed this activity <span className="text-blue-600 font-bold">{activityCount}</span> times.
            </p>
          ) : (
            <p className="text-gray-500">No activity data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserActivitiesPage;
