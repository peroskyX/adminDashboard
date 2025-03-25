import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin'; // Firebase Admin SDK

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, limit = 20 } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    let userUid = userId as string;

    // If searching by email, retrieve user UID first
    if (email) {
      const userSnapshot = await db
        .collection('users')
        .where('email', '==', email)
        .get();
      if (userSnapshot.empty)
        return res.status(404).json({ error: 'User not found' });

      userUid = userSnapshot.docs[0].id;
    }

    // Query user activity logs
    const logsQuery = db
      .collection('userActivityLogs')
      .where('userId', '==', userUid)
      .orderBy('timestamp', 'desc')
      .limit(Number(limit));

    const logsSnapshot = await logsQuery.get();

    const logs = logsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
