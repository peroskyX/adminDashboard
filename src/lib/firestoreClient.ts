import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  doc,
  getDoc,
  updateDoc,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { firebaseClientApp } from './firebaseClient'; // Initialize Firebase

const db = getFirestore(firebaseClientApp);

export const fetchBusinessesVerification = async (
  pageSize = 10,
  lastVisibleDoc = null
) => {
  const businessesRef = collection(db, 'businesses');

  // Query businesses ordered by verificationOrder
  let q = query(
    businessesRef,
    orderBy('verificationOrder', 'asc'),
    limit(pageSize)
  );

  if (lastVisibleDoc) {
    q = query(
      businessesRef,
      orderBy('verificationOrder', 'asc'),
      startAfter(lastVisibleDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);

  const businessList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() ?? null, // Convert Firestore Timestamp to JavaScript Date
  }));

  return {
    businesses: businessList,
    lastVisible: snapshot.docs[snapshot.docs.length - 1], // Last doc for pagination
  };
};

// Function to update the verificationOrder field of a business
export const updateBusinessVerificationOrder = async (
  id: string,
  verificationOrder: number
) => {
  const businessDocRef = doc(db, 'businesses', id);
  try {
    await updateDoc(businessDocRef, { verificationOrder });
    console.log(
      `Successfully updated business ${id} verificationOrder to ${verificationOrder}`
    );
  } catch (error) {
    console.error('Error updating verificationOrder:', error);
    throw new Error('Failed to update the verificationOrder field.');
  }
};

export const fetchAllBusinesses = async () => {
  const businessCollection = collection(db, 'businesses');
  const q = query(businessCollection);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch a list of businesses with pagination

export const fetchBusinesses = async (
  pageSize = 10,
  lastVisibleDoc = null,
  searchQuery = ''
) => {
  const businessesRef = collection(db, 'businesses');

  let q = query(businessesRef, orderBy('timestamp', 'desc'), limit(pageSize));

  if (searchQuery) {
    q = query(
      businessesRef,
      where('businessEmail', '>=', searchQuery),
      where('businessEmail', '<=', searchQuery + '\uf8ff'), // Firestore range query
      orderBy('businessEmail'), // Ensure query ordering
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );
  }

  if (lastVisibleDoc) {
    q = query(q, startAfter(lastVisibleDoc)); // Continue pagination from last doc
  }

  const snapshot = await getDocs(q);

  const businessList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() ?? null, // Convert Firestore Timestamp to Date
  }));

  return {
    businesses: businessList,
    lastVisible:
      snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
  };
};

export const fetchProfiles = async (pageSize = 10, lastVisibleDoc = null) => {
  const usersRef = collection(db, 'profiles');
  let q = query(usersRef, orderBy('createdAt', 'desc'), limit(pageSize)); // Order by 'createdAt' descending

  if (lastVisibleDoc) {
    q = query(
      usersRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisibleDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const usersList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    users: usersList,
    lastVisible: snapshot.docs[snapshot.docs.length - 1], // Last doc for pagination
  };
};

// Function to fetch the details of a single business by its ID
export const fetchBusinessDetails = async (id: string) => {
  const businessDocRef = doc(db, 'businesses', id);
  const businessDoc = await getDoc(businessDocRef);

  if (!businessDoc.exists()) {
    throw new Error('Business not found');
  }

  const data = businessDoc.data();

  return {
    id: businessDoc.id,
    verificationStatus: data?.verificationStatus || '', // Include verificationStatus with a default value
    ...data,
  };
};

export const fetchUsersDetails = async (id: string) => {
  const profileDocRef = doc(db, 'profiles', id);
  const profileDoc = await getDoc(profileDocRef);

  if (!profileDoc.exists()) {
    throw new Error('User not found');
  }

  return {
    id: profileDoc.id,
    ...profileDoc.data(),
  };
};

// Function to fetch verification details
export const fetchVerificationDetails = async (id: string) => {
  const verificationDocRef = doc(db, 'verification', id);
  const verificationDoc = await getDoc(verificationDocRef);

  if (!verificationDoc.exists()) {
    throw new Error('Verification details not found');
  }

  const data = verificationDoc.data();

  // Return the required fields with appropriate defaults if needed
  return {
    id: verificationDoc.id,
    username: data?.username || '', // Default to an empty string if undefined
    address: data?.address || '',
    socialMediaLink: data?.socialMediaLink || '',
    employeeCount: data?.employeeCount || '',
    documentUrl: data?.documentUrl || '',
    uploadedAt: data?.uploadedAt?.toDate() || '', // Convert Firestore timestamp to Date
  };
};

// Function to update verification status
export const updateVerificationStatus = async (id: string, status: string) => {
  const businessDocRef = doc(db, 'businesses', id);
  await updateDoc(businessDocRef, { verificationStatus: status });
};

// Function to update business info (e.g., verification status)
export const updateBusiness = async (
  id: string,
  updates: Partial<{ verified: boolean }>
) => {
  const businessDocRef = doc(db, 'businesses', id);
  await updateDoc(businessDocRef, updates);
};

// Function to update the verified field of a business document
export const updateBusinessVerifiedField = async (
  id: string,
  verified: boolean
) => {
  const businessDocRef = doc(db, 'businesses', id);
  try {
    await updateDoc(businessDocRef, { verified });
    console.log(
      `Successfully updated business ${id} verified field to ${verified}`
    );
  } catch (error) {
    console.error('Error updating verified field:', error);
    throw new Error('Failed to update the verified field.');
  }
};

export const fetchUserActivityLogs = async (
  pageSize = 20,
  lastDoc = null,
  searchQuery = ''
) => {
  let q;

  if (searchQuery) {
    q = query(
      collection(db, 'userActivityLogs'),
      where('userId', '>=', searchQuery),
      where('userId', '<=', searchQuery + '\uf8ff'),
      orderBy('userId'),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );
  } else {
    q = query(
      collection(db, 'userActivityLogs'),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() ?? null,
  }));

  return {
    logs,
    lastDoc:
      snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
  };
};

// export const fetchUserActivityLogs = async (
//   pageSize = 20,
//   lastDoc: any = null,
//   partitionKey: string | null = null,
//   searchQuery: string | null = null
// ) => {
//   const activityLogsRef = collection(db, 'userActivityLogs');

//   let q: Query<DocumentData> = query(
//     activityLogsRef,
//     orderBy('timestamp', 'desc'),
//     limit(pageSize)
//   );

//   if (partitionKey) {
//     q = query(q, where('partitionKey', '==', partitionKey));
//   }

//   if (searchQuery) {
//     q = query(
//       q,
//       where('userId', '>=', searchQuery),
//       where('userId', '<=', searchQuery + '\uf8ff'),
//       orderBy('userId')
//     );
//   }

//   if (lastDoc) {
//     q = query(q, startAfter(lastDoc));
//   }

//   const snapshot = await getDocs(q);
//   const activityLogs = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//     timestamp: doc.data().timestamp?.toDate().toISOString().slice(0, 16),
//   }));

//   return {
//     activityLogs,
//     lastVisible:
//       snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
//   };
// };
