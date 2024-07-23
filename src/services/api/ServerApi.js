import axios from 'axios';
import Config from 'react-native-config';

const baseUrl = `${Config.API_URL}/api/v1`;

export const serverApi = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
