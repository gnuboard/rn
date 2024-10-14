import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileKeys } from '../constants/profile';

export const saveCredentials = async (username, password) => {
  try {
    await Keychain.setInternetCredentials('user_credentials', username, password);
  } catch (error) {
    console.error('Error saving user credentials', error);
  }
};

export const saveTokens = async (
  access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
) => {
  try {
    await Keychain.setInternetCredentials('auth_tokens', access_token, refresh_token);
    await AsyncStorage.setItem('access_token_expire_at', access_token_expire_at);
    await AsyncStorage.setItem('refresh_token_expire_at', refresh_token_expire_at);
    return { isSuccess: true };
  } catch (error) {
    console.error('Error saving tokens', error);
    return { isSuccess: false };
  }
};

export const saveSocialLoginTokens = async (tokenName, accessToken, refreshToken) =>{
  // tokenName example: 'naver_login_tokens', 'kakao_login_tokens'
  try {
    await Keychain.setInternetCredentials(tokenName, accessToken, refreshToken);
    return { isSuccess: true };
  } catch (error) {
    console.error(`Error saving ${tokenName} tokens`, error);
    return { isSuccess: false };
  }
}

export const saveLoginPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem('loginPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving login preferences', error);
  }
};

export const getLoginPreferences = async () => {
  try {
    const preferencesString = await AsyncStorage.getItem('loginPreferences');
    return preferencesString ? JSON.parse(preferencesString) : null;
  } catch (error) {
    console.error('Error retrieving login preferences', error);
    return null;
  }
};

export const getCredentials = async () => {
  try {
    const credentials = await Keychain.getInternetCredentials('user_credentials');
    return credentials ? { username: credentials.username, password: credentials.password } : null;
  } catch (error) {
    console.error('Error retrieving user credentials', error);
    return null;
  }
};

export const getTokens = async () => {
  try {
    const tokens = await Keychain.getInternetCredentials('auth_tokens');
    const access_token_expire_at = await AsyncStorage.getItem('access_token_expire_at');
    const refresh_token_expire_at = await AsyncStorage.getItem('refresh_token_expire_at');
    return tokens ? { access_token: tokens.username, refresh_token: tokens.password, access_token_expire_at, refresh_token_expire_at } : null;
  } catch (error) {
    console.error('Error retrieving tokens', error);
    return null;
  }
};

export const setGuestToken = async (guestToken, guestTokenExpireAt) => {
  try {
    await AsyncStorage.setItem('guest_token', guestToken);
    await AsyncStorage.setItem('guest_token_expire_at', guestTokenExpireAt);
    return { isSuccess: true, guestToken };
  } catch (error) {
    console.error('Error setting guest token', error);
    return { isSuccess: false };
  }
}

export const getGuestToken = async () => {
  try {
    const guestToken = await AsyncStorage.getItem('guest_token');
    const guestTokenExpireAt = await AsyncStorage.getItem('guest_token_expire_at');
    return { guestToken, guestTokenExpireAt };
  } catch (error) {
    console.error('Error retrieving guest token', error);
    return null;
  }
}

export const deleteAllSecureData = async () => {
  try {
    await Keychain.resetInternetCredentials('auth_tokens');
    await Keychain.resetInternetCredentials('naver_login_tokens');
    await Keychain.resetInternetCredentials('kakao_login_tokens');
    await Keychain.resetInternetCredentials('google_login_tokens');
    return {isSuccess: true};
  } catch (error) {
    console.error('Error deleting secure data', error);
    return {isSuccess: false};
  }
};

export const deleteUserInfo = async () => {
  try {
    await AsyncStorage.multiRemove(profileKeys);
    return {isSuccess: true};
  } catch (error) {
    console.error('deleteUserInfo, Error deleting user info', error);
    return {isSuccess: false};
  }
}

export function getRandomNick(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  const currentTime = Date.now().toString();
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += currentTime;

  return result;
}