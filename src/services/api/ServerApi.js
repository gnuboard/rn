import axios from 'axios';
import Config from 'react-native-config';

const baseUrl = `${Config.SERVER_URL}/api/v1`;

export const serverApi = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBoardNewDataRequest = async (bo_table, params) => {
  try {
    const response = await serverApi.get(
      `/board-new/writes/${bo_table}`,
      { params: params},
    );
    return response;
  } catch (error) {
    throw error;
  }
}