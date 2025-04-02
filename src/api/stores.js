import api from './axios';
import Cookies from 'js-cookie';

export const getStores = async () => {
  try {
    const response = await api.get('/stores');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStore = async (storeId, storeData) => {
  try {
    const response = await api.put(`/stores/${storeId}`, {
      ...storeData,
      userRole: Cookies.get('user-role'),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteStore = async (storeId) => {
  try {
    const response = await api.delete(`/stores/${storeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createStore = async (storeData) => {
  try {
    const response = await api.post('/stores', {
      ...storeData,
      userRole: Cookies.get('user-role'),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
