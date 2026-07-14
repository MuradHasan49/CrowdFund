import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // critical for HttpOnly cookie
});

export default api;
