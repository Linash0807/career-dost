import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button 
      onClick={logout} 
      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
};

export default LogoutButton;
