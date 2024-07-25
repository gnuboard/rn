import * as Keychain from 'react-native-keychain';

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
  } catch (error) {
    console.error('Error saving tokens', error);
  }
};