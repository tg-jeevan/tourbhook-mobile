import { useEffect, useState } from 'react';
import { VerificationStatus } from '../types/groupTypes';

export function useVerificationStatus() {
  const [status, setStatus] = useState<VerificationStatus>('pending');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('verified');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return status;
}