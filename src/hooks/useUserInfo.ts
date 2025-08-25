// useUserInfo.ts
import { getUserInfoStorage } from '@/shared/utils/helpers';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';

export const useUserInfo = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const userInfo = await getUserInfoStorage();
        if (isMounted) {
          setUser(userInfo);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, error };
};
