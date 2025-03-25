"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const CreditCodeForm = () => {
  const [maxCredits, setMaxCredits] = useState("");
  const [anchorName, setAnchorName] = useState("");
  const [creditCode, setCreditCode] = useState("");
  const [usageLimit, setUsageLimit] = useState(""); // New state for usage limits
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!maxCredits || !anchorName || creditCode.length !== 10 || !usageLimit) {
      toast.error("All fields are required, and the credit code must be 10 letters.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "credit_code"), {
        maxCredits: Number(maxCredits),
        anchorName,
        creditCode,
        usageLimit: Number(usageLimit), // Store usage limit
        createdAt: Timestamp.now(),
        redeemedCount: 0, // Track redemptions
      });

      toast.success("Credit code added successfully!");
      setMaxCredits("");
      setAnchorName("");
      setCreditCode("");
      setUsageLimit(""); // Reset usage limit field
    } catch (error) {
      console.error("Error adding credit code:", error);
      toast.error("Failed to add credit code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">Assign Credit Code</h2> {/* Now inside the form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Max Credits</label>
          <Input
            type="number"
            value={maxCredits}
            onChange={(e) => setMaxCredits(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Anchor Name</label>
          <Input
            type="text"
            value={anchorName}
            onChange={(e) => setAnchorName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">10-Letter Credit Code</label>
          <Input
            type="text"
            value={creditCode}
            onChange={(e) => setCreditCode(e.target.value)}
            maxLength={10}
            minLength={10}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Usage Limit</label>
          <Input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Credit Code"}
        </Button>
      </form>
    </div>
  );
};

export default CreditCodeForm;
