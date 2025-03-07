import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/services/authService';
import { User } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const checkAuthenticated = async () => {
    const currentUser = await fetchCurrentUser();
    setCurrentUser(currentUser);
    if (!currentUser) {
      router.push('/auth/login');
    }
  }

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return <>{currentUser ? children : null}</>;
};

export default ProtectedRoute;
