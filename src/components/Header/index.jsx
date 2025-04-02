import React from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = ({isHome}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user-role');
    Cookies.remove('user-id');
    navigate('/signin');
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Store Rating App</h1>

      <div className="grid gap-3 grid-rows-1 grid-cols-2">
        <Button variant="outline-primary" onClick={() => {
          const navii = isHome ? '/' : '/store'
          navigate(navii)
        }}>
          {isHome ? 'Home': 'Store Management'}
        </Button>
        <Button variant="outline-primary" onClick={() => handleLogout()}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
