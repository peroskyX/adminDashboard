import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin'; // Ensure Firebase Admin is correctly set up

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const pageSize = 10;
    const activitiesRef = admin.firestore().collection('userActivityLogs');
    let query = activitiesRef
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc');

    // Pagination
    if (page > 1) {
      const lastDoc = await query.limit((page - 1) * pageSize).get();
      const lastVisible = lastDoc.docs[lastDoc.docs.length - 1];
      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }
    }

    const snapshot = await query.limit(pageSize).get();
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
