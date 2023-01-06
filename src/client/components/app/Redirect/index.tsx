import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
