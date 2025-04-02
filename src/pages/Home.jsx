import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import {
  getUsers,
  deleteUser,
  updateUser,
  getUsersStats,
  createUser,
} from '../api/users';
import { getStores } from '../api/stores';
import Button from '../components/ui/Button';
import Loader from '../components/Loader';
import Input from '../components/ui/Input';
import Header from '../components/Header';
import StatsView from '../components/StatsView';

import roleConst from '../services/role.json';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    address: '',
    role: 'Normal User',
  });

  const navigate = useNavigate();

  // Role options for filter dropdown
  const roleOptions = [
    { value: 'All', label: 'All Users' },
    { value: 'System Administrator', label: 'System Administrator' },
    { value: 'Store Owner', label: 'Store Owner' },
    { value: 'Normal User', label: 'Normal User' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersData, statsData, storesData] = await Promise.all([
        getUsers(),
        getUsersStats(),
        getStores(),
      ]);
      setUsers(usersData.data);
      setStats(statsData.data);
      console.log(storesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'All') return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserForm({
      ...newUserForm,
      [name]: value,
    });
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call API to create user (adjust based on your API)
      await createUser(newUserForm);
      setIsAddingUser(false);
      setNewUserForm({ name: '', email: '', address: '', role: 'Normal User' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError(err.message || 'Failed to add user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditFormData({
      name: user.name,
      email: user.email,
      address: user.address || '',
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (userId) => {
    try {
      await updateUser(userId, editFormData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error: {error}
        <Button onClick={fetchUsers} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  const userRole = Cookies.get('user-role');
  if (userRole !== roleConst.admin && !userRole) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="p-6 max-w-md mx-auto bg-yellow-50 rounded-lg shadow-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-yellow-800">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-yellow-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <StatsView stats={stats} /> 
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Role Filter Dropdown */}
            <div className="relative w-full md:w-64">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <Button
              onClick={() => setIsAddingUser(true)}
              className="w-full md:w-auto"
            >
              Add New User
            </Button>
          </div>
        </div> 
        {isAddingUser && (
    <form onSubmit={handleAddUserSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Add New User</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          value={newUserForm.name}
          onChange={handleNewUserChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={newUserForm.email}
          onChange={handleNewUserChange}
          required
        />
        <Input
          label="Address"
          name="address"
          value={newUserForm.address}
          onChange={handleNewUserChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={newUserForm.role}
            onChange={handleNewUserChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="System Administrator">System Administrator</option>
            <option value="Store Owner">Store Owner</option>
            <option value="Normal User">Normal User</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        <Button type="submit">Save</Button>
        <Button
          variant="secondary"
          onClick={() => setIsAddingUser(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  )}


        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <Input
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <Input
                        name="email"
                        type="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user.id ? (
                      <Input
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditFormChange}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {user.address || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'owner'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser === user.id ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSubmit(user.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'owner'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {user.address && (
                <div className="mb-3 text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {user.address}
                </div>
              )}

              {editingUser === user.id ? (
                <div className="space-y-3 mt-2">
                  <Input
                    label="Name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditFormChange}
                  />
                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={() => handleEditSubmit(user.id)}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
