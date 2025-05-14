import React from 'react';
import { useBlockedUserCheck } from '../../hooks/useBlockedUserCheck';

interface BlockedUserGuardProps {
  children: React.ReactNode;
}

export const BlockedUserGuard: React.FC<BlockedUserGuardProps> = ({ children }) => {
  useBlockedUserCheck();
  
  return <>{children}</>;
};