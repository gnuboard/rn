import axios from 'axios';
import Config from 'react-native-config';
import { getTokens, saveTokens, deleteAllSecureData } from '../../utils/authFunc';

const baseUrl = `${Config.SERVER_URL}/api/v1`;

export const serverApi = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverApi.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens && tokens.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

serverApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const tokens = await getTokens();

    if (error.response.status === 401 && tokens && tokens.refresh_token) {
      try {
        const newTokens = await renewTokenRequest(tokens.refresh_token);
        const { access_token, refresh_token } = newTokens;
        const saveTokenResult = await saveTokens(access_token, refresh_token);
        if (!saveTokenResult.isSuccess) {
          console.error('Failed to save renewed tokens');
          return;
        }
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return serverApi(originalRequest);
      } catch(error) {
        const response = error.response;
        if (response.status === 401 && response.data.detail.includes("Token has expired")) {
          const result = await deleteAllSecureData();
          if (result.isSuccess) {
            console.log('Deleted all secure data successfully in response interceptor');
          } else {
            console.error('Failed to delete all secure data');
          }
        } else {
          console.error(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

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

export const renewTokenRequest = async (refresh_token) =>{
  const renewTokenApi = axios.create({
    baseURL: baseUrl
  })

  return renewTokenApi.post(
    "/token/refresh",
    { refresh_token: refresh_token },
    { headers: {"Content-Type": "application/x-www-form-urlencoded"} }
  )
  .then(res => res.data)
  .catch(error => {
    console.error(error);
    throw error;
  });
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