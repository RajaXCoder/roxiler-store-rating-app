import React, { useEffect, useState } from 'react';
import {
  FaUserShield,
  FaUsers,
  FaStore,
  FaUserFriends,
  FaChartLine,
} from 'react-icons/fa';

const StatsView = ({ stats }) => {
  const StatCard = ({ title, value, icon, colorClass, delay }) => (
    <div
      className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colorClass} relative overflow-hidden`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`,
        opacity: 0,
        transform: 'translateY(20px)',
      }}
    >
      <div
        className={`absolute inset-0 opacity-10 ${colorClass.replace('bg-opacity-10', '')}`}
      ></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${colorClass.replace('bg-opacity-10', 'bg-opacity-20')}`}
        >
          {React.cloneElement(icon, { className: 'w-6 h-6 text-white' })}
        </div>
      </div>
      <div className="relative z-10 mt-4">
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClass.replace('bg-opacity-10', '')}`}
            style={{ width: `${(value / (stats.totalUsers || 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1
        className="text-3xl font-bold text-gray-800 mb-8"
        style={{
          animation: 'fadeInUp 0.8s ease-out forwards',
          opacity: 0,
          transform: 'translateY(20px)',
        }}
      >
        <FaChartLine className="inline mr-3" />
        User Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={<FaUserShield />}
          colorClass="bg-purple-500 bg-opacity-10"
          delay={100}
        />

        <StatCard
          title="Normal Users"
          value={stats.totalNormalUsers}
          icon={<FaUsers />}
          colorClass="bg-blue-500 bg-opacity-10"
          delay={200}
        />

        <StatCard
          title="Store Owners"
          value={stats.totalStoreOwners}
          icon={<FaStore />}
          colorClass="bg-green-500 bg-opacity-10"
          delay={300}
        />

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUserFriends />}
          colorClass="bg-yellow-500 bg-opacity-10"
          delay={400}
        />
      </div>

      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StatsView;
