import { useUserLogs } from "@/hooks/useUserLogs";
import { useState } from "react";

const UserActivity = () => {
  const { query, setQuery, logs, loading, error, fetchLogs } = useUserLogs();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Activity Logs</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email or user ID"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={fetchLogs}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Activity Type</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Metadata</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border">
              <td className="border p-2">{new Date(log.timestamp?.seconds * 1000).toLocaleString()}</td>
              <td className="border p-2">{log.activityType}</td>
              <td className="border p-2">{log.category}</td>
              <td className="border p-2">
                {JSON.stringify(log.metadata)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivity;
