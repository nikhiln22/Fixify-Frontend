import React from 'react';
import { UserNavbar } from '../components/user/UserNavbar';
import { UserFooter } from '../components/user/UserFooter';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <UserFooter />
    </div>
  );
};

export default UserLayout;