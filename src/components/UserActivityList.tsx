"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "./ui/businessButton";
import { activityTypeMap } from "@/types/activitycodes";

interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  category: string;
  platformSource: string;
  timestamp: Date | null;
}

export default function UserActivityList({ pageSize = 20 }) {
  const [logs, setLogs] = useState<UserActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [partitionKey, setPartitionKey] = useState(""); // Dynamic Partition Key
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [paginationStack, setPaginationStack] = useState<any[]>([]);
  const [availablePartitions, setAvailablePartitions] = useState<string[]>([]);

  // Fetch available partitions (You can replace this with a backend call if needed)
  useEffect(() => {
    const fetchPartitions = async () => {
      const now = new Date();
      const partitions = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        partitions.push(`${year}-${month}`);
      }
      setAvailablePartitions(partitions);
    };

    fetchPartitions();
  }, []);

  useEffect(() => {
    if (partitionKey) {
      loadLogs(false);
    }
  }, [searchQuery, partitionKey]); // Trigger on partition key change or search query update

  const loadLogs = async (nextPage = false) => {
    if (!partitionKey) return; // Ensure a partition key is selected

    setLoading(true);
    try {
      const response = await fetch(`/api/fetchUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSize,
          lastDoc: nextPage ? lastVisible : null,
          searchQuery,
          partitionKey,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch logs");

      const data = await response.json();
      setLogs(data.logs);
      setLastVisible(data.lastDoc);

      if (nextPage) {
        setPaginationStack((prev) => [...prev, lastVisible || ""]);
      } else {
        setPaginationStack([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Search & Partition Key Selection - Styled Container */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Search & Filter Logs
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Partition Key Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={partitionKey}
              onChange={(e) => setPartitionKey(e.target.value)}
              className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 pr-8 rounded-lg text-gray-700 dark:text-gray-300 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="">Select Partition</option>
              {availablePartitions.map((pk) => (
                <option key={pk} value={pk}>
                  {pk}
                </option>
              ))}
            </select>
            {/* Dropdown Icon */}
            <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
              ▼
            </span>
          </div>
            
          {/* Search Box */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by User ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 pl-10 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            {/* Search Icon */}
            <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
              🔍
            </span>
          </div>
        </div>
      </div>


      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <>
          <DataTable
            columns={[
              { accessorKey: "userId", header: "User ID" },
              {
                accessorKey: "activityType",
                header: "Activity Type",
                cell: ({ row }) => {
                  const activityCode = Number(row.original.activityType); // Ensure it's a number
                  return activityTypeMap[activityCode] || `Unknown (${activityCode})`; // Fallback for unknown codes
                },
              },
              { accessorKey: "platformSource", header: "Platform" },
              {
                accessorKey: "timestamp",
                header: "Timestamp",
                cell: ({ row }) =>
                  row.original.timestamp
                    ? new Date(row.original.timestamp).toLocaleString()
                    : "N/A",
              },
            ]}
            data={logs}
          />

          {/* Pagination Controls */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={() => loadLogs(false)}
              variant="outline"
              size="sm"
              disabled={paginationStack.length === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => loadLogs(true)}
              variant="outline"
              size="sm"
              disabled={!lastVisible}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
