import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import authService from '../services/auth.services';
import Cookies from 'js-cookie';

export const useBlockedUserCheck = () => {
  const location = useLocation();
  
  useEffect(() => {
    const checkIfBlocked = async () => {
      const pathname = location.pathname;
      
      if (pathname.includes('/admin')) return;
      
      let role: 'USER' | 'TECHNICIAN' = 'USER';
      
      if (pathname.includes('/technician')) {
        role = 'TECHNICIAN';
      }

      const accessToken = Cookies.get(`${role.toLowerCase()}_access_token`);
      if (!accessToken) return;
      
      try {
        await authService.checkUserStatus(role);
      } catch (error) {
        console.log("User status check failed:", error);
      }
    };
    
    checkIfBlocked();
  }, [location.pathname]);
};