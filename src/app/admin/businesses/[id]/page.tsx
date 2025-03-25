"use client"; // This is a Client Component

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchBusinessDetails, updateBusiness } from "@/lib/firestoreClient"; // Assuming these functions exist

const BusinessDetails = () => {
  const { id } = useParams(); // Get route parameter
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchBusinessDetails(id)
        .then((data) => {
          setBusiness(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching business details:', error);
          setError('Failed to fetch business details.');
          setLoading(false);
        });
    } else {
      setError('Invalid ID');
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setBusiness((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      if (typeof id === 'string') {
        await updateBusiness(id, business); // Assuming this updates the data in Firestore
        alert("Business details updated successfully!");
      } else {
        throw new Error("Invalid ID provided");
      }
    } catch (error) {
      console.error("Error saving business details:", error);
      setError("Failed to save business details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading business details...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Business Details</h1>

      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            value={business?.businessName || ""}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={business?.businessEmail || ""}
            onChange={(e) => handleInputChange("businessEmail", e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Credits
          </label>
          <input
            type="number"
            value={business?.credits || 0}
            onChange={(e) => handleInputChange("credits", Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            AccountIsActive
          </label>
          <select
            value={business?.active ? "true" : "false"}
            onChange={(e) =>
              handleInputChange("verified", e.target.value === "true")
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="true">Activate</option>
            <option value="false">Deactivate</option>
          </select>
        </div>

        {/* Add more fields as needed */}
      </form>

      <div className="flex items-center justify-between mt-6">
        {saving ? (
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded-md"
          >
            Saving...
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        )}

        {error && <p className="text-red-500 ml-4">{error}</p>}
      </div>
    </div>
  );
};

export default BusinessDetails;
