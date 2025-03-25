import { useEffect, useState } from "react";

const API_URL =
  "https://us-central1-windowshopai-36c5c.cloudfunctions.net/getUserAnalytics";

const useFetchUserAnalytics = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) throw new Error("Failed to fetch user analytics");

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchUserAnalytics;
