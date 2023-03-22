import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Redirect({ to }: { to: string }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    router.replace(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return null;
}
