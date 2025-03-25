// Business data type
export interface Business {
  id: string;
  businessEmail: string;
  businessName: string;
  verificationStatus: 'verified' | 'notVerified' | 'pending' | string; // Allowing string for flexibility
  onActiveSubscription: boolean;
  verified?: boolean; // Optional as it wasn't used in your component
  timestamp?: Date | null; // Optional timestamp field
}

// Result type from fetchBusinesses function
export interface FetchBusinessesResult {
  businesses: Business[];
  lastVisible: any | null; // Firestore DocumentSnapshot type
  error?: string;
}

// Status classes types for styling
export type VerificationStatus = 'verified' | 'notVerified' | 'pending';
export type SubscriptionStatus = boolean;

export interface StatusClasses {
  verification: Record<VerificationStatus, string>;
  subscription: Record<string, string>; // Using string keys for boolean values
}

// Props for BusinessList component
export interface BusinessListProps {
  pageSize?: number;
  initialBusinesses?: Business[]; // Optional if you want to support SSR
}

export interface BusinessListState {
  businesses: Business[];
  filteredBusinesses: Business[];
  searchQuery: string;
  loading: boolean;
  paginationStack: any[]; // Consider using DocumentSnapshot[] if you want to be more specific
  lastVisible: any | null; // Consider using DocumentSnapshot | null
  error?: string;
}
