import React, { useState, useEffect } from 'react';
import { getUsersStats } from '../api/users';

const StatsView = () => {
  const [error, setError] = useState(null);

  const getUsersStats = async () => {
    try {
      const data = await getUsersStats();
      console.log(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user stats');
    }
  };

  useEffect(() => {
    getUsersStats();
  }, []);

  if (error) {
    return (
      <header className="bg-red-500 text-white p-4">
        <h1 className="text-2xl">Store Rating App</h1>
        <p className="text-red-200">{error}</p>
      </header>
    );
  }
  return <div>Stats View</div>;
};

export default StatsView;
