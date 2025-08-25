import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PATH_NAME } from '../../configs';
import { getAccessToken } from '@/shared/utils/helpers';

interface IAuthGuard {
  children?: React.ReactNode;
}

const AuthGuard = ({ children }: IAuthGuard) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      setIsAuth(!!token);
    };
    checkAuth();
  }, []);

  if (isAuth === null) return null;

  if (!isAuth) return <Navigate to={PATH_NAME.LOGIN} replace={true} />;

  return <>{children}</>;
};

export default AuthGuard;
