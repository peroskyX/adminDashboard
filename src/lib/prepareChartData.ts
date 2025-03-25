import { AnalyticsData } from './fetchData';
import { firestore } from './firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface ChartData {
  platformLabels: string[];
  platformData: number[];
  businessLabels: string[];
  businessData: number[];
}

const defaultChartData: ChartData = {
  platformLabels: [],
  platformData: [],
  businessLabels: [],
  businessData: [],
};

/**
 * Fetches business names in bulk using Firestore `where` query.
 * @param businessIds List of business IDs to fetch.
 */
const fetchBusinessNames = async (businessIds: string[]): Promise<string[]> => {
  if (businessIds.length === 0) return [];

  try {
    const businessCollection = collection(firestore, 'businesses');

    // Firestore allows a maximum of 10 IDs per `in` query
    const batches = [];
    for (let i = 0; i < businessIds.length; i += 10) {
      batches.push(businessIds.slice(i, i + 10));
    }

    const nameMap = new Map<string, string>();

    for (const batch of batches) {
      const q = query(businessCollection, where('__name__', 'in', batch));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        nameMap.set(doc.id, doc.data().businessName || 'Unknown');
      });
    }

    return businessIds.map((id) => nameMap.get(id) || 'Unknown');
  } catch (error) {
    console.error('Error fetching business names:', error);
    return businessIds.map(() => 'Unknown');
  }
};

/**
 * Prepares chart data by mapping analytics data to labels and values.
 * @param data Analytics data to process.
 */
export const prepareChartData = async (
  data: AnalyticsData | null | undefined
): Promise<ChartData> => {
  if (!data) {
    console.warn('No analytics data available.');
    return defaultChartData;
  }

  const platformStats = data.platformStats || {};
  const topBusinesses = data.topBusinesses || {};

  const platformLabels = Object.keys(platformStats).map((key) =>
    key.replace(/_/g, ' ')
  );
  const platformData = Object.values(platformStats);

  const businessData = Object.values(topBusinesses);
  const businessIds = Object.keys(topBusinesses);

  const businessLabels = await fetchBusinessNames(businessIds);

  return {
    platformLabels,
    platformData,
    businessLabels,
    businessData,
  };
};
