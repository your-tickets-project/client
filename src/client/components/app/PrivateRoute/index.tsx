import React from 'react';
// components
import Redirect from 'client/components/app/Redirect';
// store
import { AuthSelector } from 'client/store/selectors';

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = AuthSelector();

  if (!isAuthenticated) return <Redirect to="/" />;

  return <>{children}</>;
}
