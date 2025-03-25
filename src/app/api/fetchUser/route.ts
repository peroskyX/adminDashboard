import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Use Firebase Admin SDK

// Function to fetch user activity logs
export async function POST(req: NextRequest) {
  try {
    const {
      pageSize = 20,
      lastDoc = null,
      searchQuery = '',
      partitionKey = '',
    } = await req.json();

    if (!partitionKey) {
      return NextResponse.json(
        { error: 'Partition key is required' },
        { status: 400 }
      );
    }

    let queryRef = db
      .collection('userActivityLogs')
      .where('partitionKey', '==', partitionKey) // Ensure partitioned query
      .orderBy('timestamp', 'desc')
      .limit(pageSize);

    // If searching for a specific userId
    if (searchQuery) {
      queryRef = db
        .collection('userActivityLogs')
        .where('partitionKey', '==', partitionKey)
        .where('userId', '==', searchQuery)
        .orderBy('timestamp', 'desc') //
        .limit(pageSize);
    }

    // Apply pagination
    if (lastDoc) {
      const lastSnapshot = await db
        .collection('userActivityLogs')
        .doc(lastDoc)
        .get();
      if (lastSnapshot.exists) {
        queryRef = queryRef.startAfter(lastSnapshot);
      }
    }

    const snapshot = await queryRef.get();
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() ?? null, // Convert Firestore timestamp to JavaScript Date
    }));

    return NextResponse.json({
      logs,
      lastDoc:
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1].id
          : null,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
