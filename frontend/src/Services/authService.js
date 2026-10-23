import api from './api';

const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export default {
  register,
  login,
};
