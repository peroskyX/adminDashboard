"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchBusinesses } from "@/lib/firestoreClient";
import { DataTable } from "@/components/DataTable";
import { Button } from "./ui/businessButton";

interface Business {
  id: string;
  businessEmail: string;
  businessName: string;
  verificationStatus: string;
  onActiveSubscription: boolean;
  verified: boolean;
}

interface BusinessListProps {
  pageSize?: number;
}

export default function BusinessList({ pageSize = 20 }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [paginationStack, setPaginationStack] = useState<any[]>([]);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBusinesses();
  }, [searchQuery, pageSize]);

  useEffect(() => {
    const filtered = businesses.filter(
      (business) =>
        business.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.id.includes(searchQuery)
    );
    setFilteredBusinesses(filtered);
  }, [searchQuery, businesses]);


  const loadBusinesses = async (nextPage = false, resetSearch = false) => {
    setLoading(true);
    try {
      const data = await fetchBusinesses(
        pageSize,
        nextPage ? lastVisible : null, // Reset pagination on new search
        searchQuery
      );
      
      // @ts-ignore
      setBusinesses(data.businesses);
      // @ts-ignore
      setFilteredBusinesses(data.businesses);
      setLastVisible(data.lastVisible);
  
      if (nextPage) {
        setPaginationStack((prev) => [...prev, lastVisible]);
      } else if (resetSearch) {
        setPaginationStack([]); // Reset pagination when search changes
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (paginationStack.length > 0) {
      const prevLastVisible = paginationStack[paginationStack.length - 1];
      setPaginationStack((prev) => prev.slice(0, -1));
      setLastVisible(prevLastVisible);
      loadBusinesses(false);
    }
  };
  
  const handleNext = () => {
    if (lastVisible) {
      loadBusinesses(true);
    }
  };

  const handleBusinessClick = (business: Business) => {
    router.push(`/admin/businesses/${business.id}`);
  };

  const getVerificationStatusClass = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500 text-white";
      case "notVerified":
        return "bg-red-500 text-white";
      case "pending":
      default:
        return "bg-yellow-500 text-white";
    }
  };

  const getActiveSubscriptionClass = (isActive: boolean) =>
    isActive ? "bg-green-500 text-white" : "bg-red-500 text-white";

  return (
    <div className="space-y-6">
      {loading ? (
        <p>Loading businesses...</p>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={[
                { accessorKey: "businessName", header: "Business Name" },
                { accessorKey: "businessEmail", header: "Business Email" },
                {
                  accessorKey: "verificationStatus",
                  header: "Verification Status",
                  cell: ({ row }) => {
                    const verificationStatus = row.getValue("verificationStatus") as string;
                    return (
                      <span
                        className={`px-2 py-1 rounded-full ${getVerificationStatusClass(verificationStatus)}`}
                      >
                        {verificationStatus}
                      </span>
                    );
                  },
                },
                {
                  accessorKey: "onActiveSubscription",
                  header: "Active Subscription",
                  cell: ({ row }) => {
                    const isActive = row.getValue("onActiveSubscription") as boolean;
                    return (
                      <span className={`px-2 py-1 rounded-full ${getActiveSubscriptionClass(isActive)}`}>
                        {isActive ? "Yes" : "No"}
                      </span>
                    );
                  },
                },
              ]}
              data={filteredBusinesses}
              onRowClick={handleBusinessClick}
              onSearch={setSearchQuery}
            />
          </div>

          <div className="md:hidden">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-white p-4 mb-4 border rounded shadow-md"
                onClick={() => handleBusinessClick(business)}
              >
                <h3 className="font-bold text-xl">{business.businessName}</h3>
                <p>
                  <strong>Email:</strong> {business.businessEmail}
                </p>
                <p>
                  <strong>Verification Status:</strong>{" "}
                  <span className={`px-2 py-1 rounded-full ${getVerificationStatusClass(business.verificationStatus)}`}>
                    {business.verificationStatus}
                  </span>
                </p>
                <p>
                  <strong>Active Subscription:</strong>{" "}
                  <span className={`px-2 py-1 rounded-full ${getActiveSubscriptionClass(business.onActiveSubscription)}`}>
                    {business.onActiveSubscription ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={handlePrevious} variant="outline" size="sm" disabled={paginationStack.length === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} variant="outline" size="sm" disabled={!lastVisible}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
