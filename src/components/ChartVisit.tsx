import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useFetchVisitData from "@/hooks/useFetchVisitData";

const VisitChart = () => {
  const { data, loading, error } = useFetchVisitData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const formattedData = Object.entries(data).flatMap(([period, visits]) =>
    // @ts-ignore
    visits.map((item: any) => ({
      businessId: item.businessId,
      visitCount: item.visitCount,
      period,
    }))
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Visit Trends</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={formattedData}>
          <XAxis dataKey="businessId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitCount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitChart;
