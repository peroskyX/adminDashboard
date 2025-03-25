import { useState } from 'react';
import axios from 'axios';

// Define a type for log entries
interface UserLog {
  id: string;
  userId: string;
  activityType: number;
  category: string;
  metadata: Record<string, any>;
  timestamp: { seconds: number; nanoseconds: number };
}

export const useUserLogs = () => {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState<UserLog[]>([]); // Specify the type here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<UserLog[]>('/api/user-logs', {
        params: query.includes('@') ? { email: query } : { userId: query },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch logs.');
    }

    setLoading(false);
  };

  return { query, setQuery, logs, loading, error, fetchLogs };
};
