import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://d804-178-91-71-18.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
