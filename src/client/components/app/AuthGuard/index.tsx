import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// store
import { AuthSelector } from 'client/store/selectors';
import {
  authLogOut,
  authCheckUser,
  authLoading,
} from 'client/store/actions/auth';
// services
import { checkUser } from 'client/services/auth.service';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, isLoading } = AuthSelector();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!accessToken) {
      authLoading();
      return;
    }
    const queryAPI = async () => {
      try {
        const res = await checkUser();
        authCheckUser({ user: res.data.user });
      } catch (error: any) {
        authLogOut();
        toast.error(error?.response?.data?.message || 'Internal server error.');
      }
      authLoading();
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (isLoading) return null;

  return <>{children}</>;
}
