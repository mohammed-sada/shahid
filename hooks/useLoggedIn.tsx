import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { m } from '../lib/magic-links';

export default function useLoggedIn(): {
  loading: Boolean;
  isLoggedIn: Boolean;
} {
  const router = useRouter();
  const [isLoggedIn, setIsloggedIn] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function isLoggedIn() {
      const result = await m!.user.isLoggedIn().catch((err) => {
        console.log(err);
        setLoading(false);
      });

      console.log(result);
      setIsloggedIn(result);
      setLoading(false);
    }
    isLoggedIn();
  }, [router]);

  return { loading, isLoggedIn };
}
