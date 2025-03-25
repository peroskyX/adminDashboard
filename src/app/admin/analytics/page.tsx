"use client";

import React, { useEffect, useState } from "react";
import { fetchAnalyticsData } from "../../../lib/fetchData";
import { ChartData, prepareChartData } from "../../../lib/prepareChartData";
import { AnalyticsCharts } from "../../../components/AnalyticsCharts";
import VisitTable from "@/components/VisitTable";

const AnalyticsPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("60"); // Default period of 60

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalyticsData(period);
        const preparedData = await prepareChartData(data);
        setChartData(preparedData);
      } catch (error) {
        console.error("Error loading analytics data:", error);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period]); // Fetch data when period changes

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <h2 className="text-2xl font-bold mb-4">Subscription Click Statistics</h2>
        <div className="mb-4">
          <label htmlFor="period" className="block text-gray-700 font-medium mb-2">
            Select Period:
          </label>
          <select
            id="period"
            value={period}
            onChange={handlePeriodChange}
            className="border p-2 w-48 rounded shadow-sm focus:ring focus:ring-indigo-200"
          >
            <option value="7">7 days</option>
            <option value="14">2 weeks</option>
            <option value="30">1 month</option>
            <option value="60">2 months</option>
          </select>
        </div>
        {chartData && <AnalyticsCharts chartData={chartData} />}
      </div>
      <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 p-6">Offerings with Most Visit</h1>
        <VisitTable />
      </div>
    </div>
  );
};

export default AnalyticsPage;

