import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCredentials = async (username, password) => {
  try {
    await Keychain.setInternetCredentials('user_credentials', username, password);
    console.log('User credentials saved successfully');
  } catch (error) {
    console.error('Error saving user credentials', error);
  }
};

export const saveTokens = async (access_token, refresh_token) => {
  try {
    await Keychain.setInternetCredentials('auth_tokens', access_token, refresh_token);
    console.log('Tokens saved successfully');
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
    console.log(`${tokenName} saved successfully`);
    return { isSuccess: true };
  } catch (error) {
    console.error('Error saving naver tokens', error);
    return { isSuccess: false };
  }
}

export const saveLoginPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem('loginPreferences', JSON.stringify(preferences));
    console.log('Login preferences saved successfully');
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
    return tokens ? { access_token: tokens.username, refresh_token: tokens.password } : null;
  } catch (error) {
    console.error('Error retrieving tokens', error);
    return null;
  }
};

export const deleteAllSecureData = async () => {
  try {
    await Keychain.resetInternetCredentials('user_credentials');
    await Keychain.resetInternetCredentials('auth_tokens');
    await Keychain.resetInternetCredentials('naver_login_tokens');
    console.log('All secure data deleted successfully');
    return {isSuccess: true};
  } catch (error) {
    console.error('Error deleting secure data', error);
    return {isSuccess: false};
  }
};

export const deleteUserInfo = async () => {
  try {
    const keys = [
      'mb_id',
      'mb_nick',
      'mb_email',
      'mb_point',
      'mb_profile',
      'mb_icon_path',
      'mb_image_path',
      'mb_name',
      'mb_memo_cnt',
      'mb_scrap_cnt',
    ];
    await AsyncStorage.multiRemove(keys);
    return {isSuccess: true};
  } catch (error) {
    console.error('deleteUserInfo, Error deleting user info', error);
    return {isSuccess: false};
  }
}