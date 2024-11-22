import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NaverLogin from '@react-native-seoul/naver-login';
import { logout as kakaoLogout } from "@react-native-seoul/kakao-login";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getTokens, deleteAllSecureData, deleteUserInfo } from '../../utils/authFunc';
import { removeQuotes } from '../../utils/stringFunc';
import { profileKeys } from '../../constants/profile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const tokens = await getTokens();
      if (tokens) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const loginMethod = await AsyncStorage.getItem('login_method');
      if (loginMethod === 'naver') {
        NaverLogin.logout();
      } else if (loginMethod === 'kakao') {
        kakaoLogout();
      } else if (loginMethod === 'google') {
        GoogleSignin.signOut();
      }

      const deleteResult =  await deleteAllSecureData();
      if (!deleteResult.isSuccess) {
        console.error('Failed to delete secure data');
        return { isSuccess: false };
      }
      const deleteUserInfoResult = await deleteUserInfo();
      if (!deleteUserInfoResult.isSuccess) {
        console.error('Failed to delete user info');
        return { isSuccess: false };
      }
      setIsLoggedIn(false);
      return { isSuccess: true };
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getCurrentUserData = async () => {
    const results = await AsyncStorage.multiGet(profileKeys);
    const data = Object.fromEntries(
      results.map(([key, value]) => [key, removeQuotes(value)])
    );
    return data;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn,
        loading,
        logout,
        setIsLoggedIn,
        getCurrentUserData,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);