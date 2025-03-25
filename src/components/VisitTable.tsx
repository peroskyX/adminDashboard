"use client";

import useFetchVisitData from "@/hooks/useFetchVisitData";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, doc, getDoc } from "firebase/firestore";

const VisitTable = () => {
  const { data, loading, error } = useFetchVisitData();
  const [businessNames, setBusinessNames] = useState<Record<string, string>>({});
  const [offeringTitles, setOfferingTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return;

      const uniqueBusinessIds = new Set<string>();
      const uniqueOfferingIds = new Set<string>();

      Object.entries(data).forEach(([_, visits]) => {
        // @ts-ignore
        visits.forEach((item: any) => {
          uniqueBusinessIds.add(item.businessId);
          uniqueOfferingIds.add(item.offeringId);
        });
      });

      const namesMap: Record<string, string> = {};
      const titlesMap: Record<string, string> = {};

      await Promise.all([
        // Fetch Business Names
        ...Array.from(uniqueBusinessIds).map(async (businessId) => {
          const businessRef = doc(collection(db, "businesses"), businessId);
          const businessSnap = await getDoc(businessRef);
          if (businessSnap.exists()) {
            namesMap[businessId] = businessSnap.data().businessName;
          } else {
            namesMap[businessId] = "Unknown Business";
          }
        }),

        // Fetch Offering Titles
        ...Array.from(uniqueOfferingIds).map(async (offeringId) => {
          const offeringRef = doc(collection(db, "offerings"), offeringId);
          const offeringSnap = await getDoc(offeringRef);
          if (offeringSnap.exists()) {
            titlesMap[offeringId] = offeringSnap.data().title;
          } else {
            titlesMap[offeringId] = "Unknown Offering";
          }
        }),
      ]);

      setBusinessNames(namesMap);
      setOfferingTitles(titlesMap);
    };

    fetchData();
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Offerings Visit Data</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Offering Title</TableHead>
            <TableHead>Visit Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(data).map(([period, visits]) =>
            // @ts-ignore
            visits.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{businessNames[item.businessId] || "Loading..."}</TableCell>
                <TableCell>{offeringTitles[item.offeringId] || "Loading..."}</TableCell>
                <TableCell>{item.visitCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitTable;
