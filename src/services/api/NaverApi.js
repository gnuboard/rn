import axios from 'axios';
import { NativeModules } from 'react-native';

const naverAPIUrl = 'https://openapi.naver.com';

const loginBaseUrl = `${naverAPIUrl}/v1/nid`;

const { NaverLogin } = NativeModules;


export const getNaverTokens = async () => {
  try {
    const loginResult = await NaverLogin.login();
    return loginResult;
  } catch (error) {
    throw error;
  }
}

export const naverProfileRequest = async (accessToken) => {
  try {
    const profileAPIUrl = `${loginBaseUrl}/me`;
    const profileResponse = await axios.get(profileAPIUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { response } = profileResponse.data;
    return response;
  } catch (error) {
    throw error;
  }
}

export const naverLogout = async () => {
  try {
    await NaverLogin.logout();
  } catch (error) {
    throw error;
  }
}