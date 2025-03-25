export interface AnalyticsData {
  period: string;
  totalClicks: number;
  platformStats: Record<string, number>;
  topBusinesses: Record<string, number>;
}

export const fetchAnalyticsData = async (
  period: string = '60'
): Promise<AnalyticsData | null> => {
  const apiUrl = `https://us-central1-windowshopai-36c5c.cloudfunctions.net/getSubscriptionClickStats?period=${period}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Server returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('Fetched analytics data:');

    if (
      typeof data === 'object' &&
      data !== null &&
      typeof data.period === 'string' &&
      typeof data.totalClicks === 'number' &&
      typeof data.platformStats === 'object' &&
      typeof data.topBusinesses === 'object'
    ) {
      return data;
    } else {
      console.warn('Received malformed analytics data:');
      return null;
    }
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error or CORS issue:', error);
    } else {
      console.error('Error fetching analytics data:', error);
    }
    return null;
  }
};
