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

export const loginRequest = async (username, password) => {
  try {
    const response = await serverApi.post('/token',
    { username, password },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded'} },
  );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchBoardNewDataRequest = async (bo_table, params) => {
  try {
    const response = await serverApi.get(
      `/board-new/writes/${bo_table}`,
      { params: params },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchWriteRequest = async (bo_table, wr_id) => {
  try {
    const response = await serverApi.get(`/boards/${bo_table}/writes/${wr_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}