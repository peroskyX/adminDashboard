'use client'; 

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  fetchVerificationDetails,
  fetchBusinessDetails,
  updateVerificationStatus,
  updateBusinessVerifiedField, 
  updateBusinessVerificationOrder,
} from '@/lib/firestoreClient';

const VerificationPage = () => {
  const { id } = useParams(); // Retrieve the dynamic route parameter
  const [details, setDetails] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id && typeof id === 'string') {
        try {
          const verificationDetails = await fetchVerificationDetails(id);
          setDetails(verificationDetails);

          const businessDetails = await fetchBusinessDetails(id);
          setVerificationStatus(businessDetails.verificationStatus || '');
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch verification details.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid ID on data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusChange = (value: string) => {
    setVerificationStatus(value);
  };

  const getVerificationOrder = (status: string) => {
    if (status === 'verified') return 3;
    if (status === 'notVerified') return 2;
    return 1; // Default for pending or unknown status
  };

  const handleSave = async () => {
    if (!id || typeof id !== 'string') {
      setError('Invalid ID');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Update the verification status
      await updateVerificationStatus(id, verificationStatus);

      // If status is "verified," update the `verified` field in the business collection
      await updateBusinessVerifiedField(id, verificationStatus === 'verified');

      // Also, update the verificationOrder based on the new status
      const verificationOrder = getVerificationOrder(verificationStatus);
      await updateBusinessVerificationOrder(id, verificationOrder);

      alert('Verification status and business details updated successfully!');
    } catch (err) {
      console.error('Error updating verification status:', err);
      setError('Failed to update verification status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Verification Details</h1>

      {details && (
        <div className="space-y-4">
          <div>
            <strong>Username:</strong> {details.username}
          </div>
          <div>
            <strong>Address:</strong> {details.address}
          </div>
          <div>
            <strong>Social Media Link:</strong>{' '}
            <a href={details.socialMediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {details.socialMediaLink}
            </a>
          </div>
          <div>
            <strong>Employee Count:</strong> {details.employeeCount}
          </div>
          <div>
            <strong>Document:</strong>{' '}
            <img src={details.documentUrl} alt="Document" className="max-w-full h-auto border rounded-md" />
          </div>
          <div>
            <strong>Uploaded At:</strong> {new Date(details.uploadedAt).toLocaleString()}
          </div>
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="verification-status" className="block text-sm font-medium text-gray-700">
          Verification Status
        </label>
        <select
          id="verification-status"
          value={verificationStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select a status</option>
          <option value="verified">Verify</option>
          <option value="notVerified">Reject</option>
        </select>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 text-white rounded-md ${saving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default VerificationPage;
