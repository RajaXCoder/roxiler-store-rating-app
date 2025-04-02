import React from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user-role');
    navigate('/signin');
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Store Rating App</h1>

      <div className="grid gap-3 grid-rows-1 grid-cols-2">
        <Button variant="primary" onClick={() => navigate('/stats')}>
          Stats
        </Button>
        <Button variant="primary" onClick={() => handleLogout()}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
