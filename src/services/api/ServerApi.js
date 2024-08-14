import axios from 'axios';
import Config from 'react-native-config';
import { getTokens, saveTokens } from '../../utils/authFunc';

const baseUrl = `${Config.SERVER_URL}/api/v1`;

export const serverApi = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (logout) => {
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
  
      if (axios.isAxiosError(error)) {
        if (error.message === 'Network Error') {
          console.error("axios response interceptors: Network Error");
          throw error;
        }
      };
      
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
            delete originalRequest.headers.Authorization;
            const logoutResult = await logout();
            if (logoutResult.isSuccess) {
              return serverApi(originalRequest);
            } else {
              console.error("reponse interceptors, Failed to logout");
            }
          } else {
            console.error(error);
          }
        }
      }
      return Promise.reject(error);
    }
  );
}

export const signupRequest = async (formData) => {
  try {
    const response = await serverApi.post('/members', formData);
    return response;
  } catch (error) {
    throw error;
  }
}

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

export const fetchPersonalInfoRequest = async () => {
  try {
    const response = await serverApi.get('/members/me');
    return response;
  } catch (error) {
    throw error;
  }
}

export const updatePersonalInfoRequest = async (data) => {
  try {
    const response = await serverApi.put('/member', data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateMbImgRequest = async (formData) => {
  try {
    const response = await serverApi.put(
      '/member/image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchBoardConfigRequest = async (bo_table) => {
  try {
    const response = await serverApi.get(`/boards/${bo_table}`);
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

export const fetchSecretWriteRequest = async (bo_table, wr_id, wr_password) => {
  try {
    const response = await serverApi.post(
      `/boards/${bo_table}/writes/${wr_id}`,
      JSON.stringify(wr_password),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchWriteListRequest = async (bo_table, params) => {
  try {
    const response = await serverApi.get(`/boards/${bo_table}/writes`, {
      params: params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const createWriteRequest = async (bo_table, data) => {
  try {
    const response = await serverApi.post(
      `/boards/${bo_table}/writes`,
      data,
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateWriteRequest = async (bo_table, wr_id, data) => {
  try {
    const response = await serverApi.put(
      `/boards/${bo_table}/writes/${wr_id}`,
      data,
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteWriteRequest = async (bo_table, wr_id) => {
  try {
    const response = await serverApi.delete(`/boards/${bo_table}/writes/${wr_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchCommentsRequest = async (bo_table, wr_id) => {
  try {
    const response = await serverApi.get(`/boards/${bo_table}/writes/${wr_id}/comments`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const createCommentRequest = async (bo_table, wr_id, data) => {
  try {
    const response = await serverApi.post(
      `/boards/${bo_table}/writes/${wr_id}/comments`,
      data,
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteCommentRequest = async (bo_table, wr_id, comment_id) => {
  try {
    const response = await serverApi.delete(`/boards/${bo_table}/writes/${wr_id}/comments/${comment_id}`);
    return response;
  } catch (error) {
    throw error;
  }
}