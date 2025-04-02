import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../components/Header'
import {
  getStores,
  updateStore,
  deleteStore,
  createStore,
} from '../api/stores';
import roleConst from '../services/role.json';
import Loader from '../components/Loader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
const StoreView = () => {
  const [lastTempId, setLastTempId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [editingStore, setEditingStore] = useState(null);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (stores.length > 0) {
      const maxId = Math.max(...stores.map((store) => store.id));
      setLastTempId(maxId);
    }
  }, [stores]);

  const getStoresData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStores();
      setStores(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoresData();
  }, []);

  const handleSubmitEdit = async (e, storeId) => {
    e.preventDefault();
    try {
      await updateStore(storeId, formData);
      setEditingStore(null);
      getStoresData();
    } catch (err) {
      setError(err.message || 'Failed to update store');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const newTempId = lastTempId + 1; // Generate new integer ID
      const storeWithId = {
        ...formData,
        id: newTempId, // Assign temporary ID (will be replaced by backend later)
      };

      await createStore(storeWithId); // Send to backend
      setIsAddingStore(false);
      setFormData({ name: '', email: '', address: '' });
      setLastTempId(newTempId); // Update last ID
      getStoresData(); // Refetch to get the real backend-assigned ID
    } catch (err) {
      setError(err.message || 'Failed to add store');
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await deleteStore(storeId);
        getStoresData();
      } catch (err) {
        setError(err.message || 'Failed to delete store');
      }
    }
  };

  const handleEditClick = (store) => {
    setEditingStore(store.id);
    setFormData({
      name: store.name,
      email: store.email,
      address: store.address,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setEditingStore(null);
    setIsAddingStore(false);
    setFormData({ name: '', email: '', address: '' });
  };

  if (Cookies.get('user-role') !== roleConst.admin) {
    navigate('/');
    return null;
  }

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
        <Button onClick={getStoresData} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
    <Header isHome/>
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Store Management</h1>
        {!isAddingStore && (
          <Button
            onClick={() => setIsAddingStore(true)}
            className="w-full md:w-auto"
          >
            Add New Store
          </Button>
        )}
      </div>

      {/* Add Store Form */}
      {isAddingStore && (
        <form
          onSubmit={handleAddStore}
          className="mb-8 p-6 bg-gray-50 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <Button type="submit" onClick={handleAddStore}>
              Add Store
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {store.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStore === store.id ? (
                    <form onSubmit={(e) => handleSubmitEdit(e, store.id)}>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full"
                        required
                      />
                    </form>
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {store.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStore === store.id ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full"
                      required
                    />
                  ) : (
                    <div className="text-sm text-gray-500">{store.email}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingStore === store.id ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full"
                      required
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      {store.address || '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingStore === store.id ? (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={(e) => handleSubmitEdit(e, store.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditClick(store)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStore(store.id)}
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
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            {editingStore === store.id ? (
              <form onSubmit={(e) => handleSubmitEdit(e, store.id)}>
                <div className="space-y-3">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                  <div className="flex space-x-2 pt-2">
                    <Button type="submit" className="flex-1">
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">ID: {store.id}</span>
                </div>
                <div className="mb-3 text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {store.address}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(store)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteStore(store.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default StoreView;
