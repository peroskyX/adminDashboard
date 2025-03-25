'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchBusinessesVerification } from "@/lib/firestoreClient";
import { DataTable } from "@/components/DataTable";

interface Business {
  id: string;
  businessEmail: string;
  businessName: string;
  verificationStatus: string;
  verified: boolean;
}

interface BusinessListProps {
  pageSize?: number;
}

export default function UnverifiedBusinessList({ pageSize = 10 }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [previousStack, setPreviousStack] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    // Filter businesses based on search query
    const filtered = businesses.filter(
      (business) =>
        business.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.id.includes(searchQuery)
    );
    setFilteredBusinesses(filtered);
  }, [searchQuery, businesses]);

  const loadBusinesses = async (nextPage = false) => {
    setLoading(true);
    try {
      const data = await fetchBusinessesVerification(pageSize, nextPage ? lastVisible : undefined);
      //@ts-ignore
      setBusinesses(data.businesses);
      //@ts-ignore
      setFilteredBusinesses(data.businesses); // Initialize filtered data
      setLastVisible(data.lastVisible);
      setIsNextAvailable(data.businesses.length === pageSize);

      if (nextPage) {
        setPreviousStack((prev) => [...prev, lastVisible]);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (previousStack.length > 0) {
      const prevLastVisible = previousStack[previousStack.length - 1];
      setPreviousStack((prev) => prev.slice(0, -1));
      setLastVisible(prevLastVisible);
      loadBusinesses();
    }
  };

  const handleNext = () => {
    loadBusinesses(true);
  };

  const handleBusinessClick = (business: Business) => {
    console.log("Navigating to business:", business.id);
    router.push(`admin/verifybusinesses/${business.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200";
      case "notVerified":
        return "bg-red-200";
      case "verified":
        return "bg-green-200";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) return <p>Loading businesses...</p>;

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <DataTable
          columns={[
            { accessorKey: "businessName", header: "Business Name" },
            { accessorKey: "businessEmail", header: "Business Email" },
            {
              accessorKey: "verificationStatus",
              header: "Verification Status",
              cell: ({ row }) => (
                <span className={`px-2 py-1 rounded ${getBackgroundColor(row.getValue("verificationStatus"))}`}>
                  {row.getValue("verificationStatus")}
                </span>
              ),
            },
            {
              accessorKey: "verified",
              header: "Verified",
              cell: ({ row }) => (row.getValue("verified") ? "Yes" : "No"),
            },
          ]}
          data={filteredBusinesses}
          onRowClick={handleBusinessClick}
          onSearch={handleSearch} // Pass search handler
        />
      </div>

      <div className="md:hidden">
        {filteredBusinesses.map((business) => (
          <div
            key={business.id}
            className={`p-4 mb-4 border rounded shadow-md ${getBackgroundColor(business.verificationStatus)}`}
            onClick={() => handleBusinessClick(business)}
          >
            <h3 className="font-bold text-xl">{business.businessName}</h3>
            <p>
              <strong>Email:</strong> {business.businessEmail}
            </p>
            <p>
              <strong>Verification Status:</strong> {business.verificationStatus}
            </p>
            <p>
              <strong>Verified:</strong> {business.verified ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}