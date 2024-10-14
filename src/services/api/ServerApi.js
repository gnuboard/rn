import { Alert } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { getTokens, saveTokens, getGuestToken, setGuestToken } from '../../utils/authFunc';
import { navigate } from '../../navigation/RootNavigation';
import { apiConfig } from './config/ServerApiConfig';

const baseUrl = `${Config.SERVER_URL}/api/v1`;

export const serverApi = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let logout = null;
let isLoggedIn = null;
let tokenInfo = null;
let isRefreshing = false;
let isLoggingOut = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

export const logoutGetter = (logoutFunc) => {
  logout = logoutFunc;
}

export const isLoggedInGetter = (isLoggedInFunc) => {
  isLoggedIn = isLoggedInFunc;
}

serverApi.interceptors.request.use(
  async (config) => {
    if (!isLoggedIn) {
      return config;
    }

    if (!tokenInfo || !tokenInfo.access_token) {
      tokenInfo = await getTokens();
    }

    config.headers.Authorization = `Bearer ${tokenInfo.access_token}`;
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
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          let newTokens;
          try {
            newTokens = await renewTokenRequest(tokens.refresh_token);
          } catch (error) {
            if (!isLoggingOut) {
              isLoggingOut = true;
              if (!logout) {
                return Promise.reject(error);
              }
              const logoutResult = await logout();
              if (logoutResult.isSuccess) {
                Alert.alert(
                  "로그아웃",
                  "로그아웃 되었습니다. 홈화면으로 이동합니다.",
                  [{
                    text: "확인",
                    onPress: () => {
                      isRefreshing = false;
                      isLoggingOut = false;
                      tokenInfo = null;
                      navigate("Home");
                    }
                  }]
                );
                return Promise.resolve();
              } else {
                console.error("reponse interceptors, Failed to logout");
              }
            }
          }

          const { access_token, refresh_token, access_token_expire_at, refresh_token_expire_at } = newTokens;
          const saveTokenResult = await saveTokens(access_token, refresh_token, access_token_expire_at, refresh_token_expire_at);
          if (!saveTokenResult.isSuccess) {
            console.error('Failed to save renewed tokens');
            return;
          }
          tokenInfo = newTokens;
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          isRefreshing = false;
          onRefreshed(access_token);
          return serverApi(originalRequest);
        } catch(error) {
          return Promise.reject(error);
        }
      }

      const retryOriginalRequest = new Promise((resolve) => {
        subscribeTokenRefresh((access_token) => {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          resolve(serverApi(originalRequest));
        });
      });

      return retryOriginalRequest;
    }
    return Promise.reject(error);
  }
);

export const handleGuestToken = async () => {
  let { guestToken, guestTokenExpireAt } = await getGuestToken();
  if (!guestToken || !guestTokenExpireAt  || new Date(guestTokenExpireAt) < new Date()) {
    const guestTokenResponse = await fetchGuestTokenRequest();
    if (guestTokenResponse.data.access_token) {
      guestToken = guestTokenResponse.data.access_token;
      guestTokenExpireAt = guestTokenResponse.data.access_token_expire_at;
      await setGuestToken(guestToken, guestTokenExpireAt);
    }
  }
  return guestToken;
}

export const fetchGuestTokenRequest = async () => {
  try {
    const response = await serverApi.post('/token/guest');
    return response;
  } catch (error) {
    throw error;
  }
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
    throw error;
  });
}

export const socialSignupRequest = async (provider, accessToken, randomNick) => {
  try {
    const response = await axios.post(
      `${baseUrl}/social/register/${provider}`,
      {"mb_nick": randomNick},
      { 'headers': { 'Authorization': `Bearer ${accessToken}` } },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const socialLoginRequest = async (provider, accessToken) => {
  try {
    const response = await serverApi.post(
      `/social/token-login/${provider}`,
      { access_token: accessToken },
    );
    return response;
  } catch (error) {
    throw error;
  }
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
    const response = await serverApi.post(
      '/member/images',
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
      { wr_password},
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

export const createGuestWriteRequest = async (bo_table, data) => {
  try {
    const guestToken = await handleGuestToken();
    const response = await axios.post(
      `${baseUrl}/boards/${bo_table}/writes`,
      data,
      { headers: { 'Authorization': `Bearer ${guestToken}` } },
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

export const uploadFilesRequest = async (bo_table, wr_id, formData) => {
  try {
    const response = await serverApi.post(
      `/boards/${bo_table}/writes/${wr_id}/files`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const checkDownloadFileAccessRequest = async (url) => {
  try {
    const response = await serverApi.get(url);
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchCommentsRequest = async (bo_table, wr_id, page) => {
  if (!page) {
    page = 1;
  }

  try {
    const response = await serverApi.get(
      `/boards/${bo_table}/writes/${wr_id}/comments?per_page=${apiConfig.commentsPerPage}&page=${page}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchSecretCommentRequest = async (bo_table, wr_id, comment_id, wr_password) => {
  try {
    const response = await serverApi.post(
      `/boards/${bo_table}/writes/${wr_id}/comments/${comment_id}`,
      { wr_password },
    );
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

export const updateCommentRequest = async (bo_table, wr_id, comment_id, data) => {
  try {
    const response = await serverApi.put(
      `/boards/${bo_table}/writes/${wr_id}/comments/${comment_id}`,
      data,
    );
    return response;
  }
  catch (error) {
    throw error;
  }
}

export const createGuestCommentRequest = async (bo_table, wr_id, data) => {
  try {
    const guestToken = await handleGuestToken();
    const response = await axios.post(
      `${baseUrl}/boards/${bo_table}/writes/${wr_id}/comments`,
      data,
      { headers: { 'Authorization': `Bearer ${guestToken}` } },
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

export const searchBoardWritesRequest = async (data) => {
  try {
    const response = await serverApi.get(
      '/search',
      { params: data }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const enrollFCMTokenRequest = async (fcmToken, platform) => {
  try {
    const response = await serverApi.post(
      '/alarm',
      {
        fcm_token: fcmToken,
        platform: platform,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}