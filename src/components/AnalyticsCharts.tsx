import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { ChartData } from "../lib/prepareChartData";

Chart.register(...registerables);

interface AnalyticsChartsProps {
  chartData: ChartData;
}

const generateColors = (count: number) => {
  return Array.from({ length: count }, () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  chartData,
}) => {
  const platformChartRef = useRef<HTMLCanvasElement | null>(null);
  const businessChartRef = useRef<HTMLCanvasElement | null>(null);
  const platformChartInstance = useRef<Chart | null>(null);
  const businessChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Cleanup previous chart instances if they exist
    platformChartInstance.current?.destroy();
    platformChartInstance.current = null;
    businessChartInstance.current?.destroy();
    businessChartInstance.current = null;

    if (!chartData.platformLabels.length && !chartData.businessLabels.length) {
      console.warn("No data available for charts.");
      return;
    }

    if (platformChartRef.current && businessChartRef.current) {
      const platformCtx = platformChartRef.current.getContext("2d");
      const businessCtx = businessChartRef.current.getContext("2d");

      if (platformCtx && businessCtx) {
        // Create Platform Stats Chart (Bar Chart)
        platformChartInstance.current = new Chart(platformCtx, {
          type: "bar",
          data: {
            labels: chartData.platformLabels,
            datasets: [
              {
                label: "Clicks by Platform",
                data: chartData.platformData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // Create Top Businesses Chart (Pie Chart)
        const businessBackgroundColors = generateColors(chartData.businessData.length);
        const businessBorderColors = generateColors(chartData.businessData.length);

        businessChartInstance.current = new Chart(businessCtx, {
          type: "pie",
          data: {
            labels: chartData.businessLabels,
            datasets: [
              {
                label: "Clicks by Business",
                data: chartData.businessData,
                backgroundColor: businessBackgroundColors,
                borderColor: businessBorderColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }

    // Cleanup charts on component unmount
    return () => {
      platformChartInstance.current?.destroy();
      platformChartInstance.current = null;
      businessChartInstance.current?.destroy();
      businessChartInstance.current = null;
    };
  }, [chartData]);

  return chartData.platformLabels.length || chartData.businessLabels.length ? (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full h-80 flex-1">
        <h2 className="text-xl font-semibold mb-2">Platform Stats</h2>
        <canvas ref={platformChartRef}></canvas>
      </div>
      <div className="w-full h-80 flex-1">
        <h2 className="text-xl font-semibold mb-2">Top Businesses</h2>
        <canvas ref={businessChartRef}></canvas>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-500">No data available for charts.</p>
  );
};
