import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export function withAdminProtection(Component: React.ComponentType<any>) {
  return function ProtectedPage(props: any) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const tokenResult = await user.getIdTokenResult();
          if (tokenResult.claims.admin) {
            setIsAdmin(true);
            setLoading(false);
          } else {
            setLoading(false);
            router.push('/'); // Redirect non-admin users to a non-admin page
          }
        } else {
          setLoading(false);
          router.push('/sign-in'); // Redirect to login page if not logged in
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return isAdmin ? <Component {...props} /> : null;
  };
}
