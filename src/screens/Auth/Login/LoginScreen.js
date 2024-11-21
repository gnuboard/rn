import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableWithoutFeedback,
  TouchableOpacity, Keyboard, Image, ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import Config from 'react-native-config';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import {
  loginRequest, socialLoginRequest, socialSignupRequest,
  enrollFCMTokenRequest
} from '../../../services/api/ServerApi';
import { fetchPersonalInfo, handleInputChange } from '../../../utils/componentsFunc';
import { logJson } from '../../../utils/logFunc';
import {
  saveCredentials, saveTokens, saveLoginPreferences, getLoginPreferences,
  getCredentials, saveSocialLoginTokens, getRandomNick
} from '../../../utils/authFunc';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTheme } from '../../../context/theme/ThemeContext';
import { Colors } from '../../../styles/colors';
import { Styles } from '../../../styles/styles';
import naverLogoCircle from '../../../assets/img/socialLogin/naver/logoCircle.png';
import kakaoLogo from '../../../assets/img/socialLogin/kakao/logo.png'
import googleLogo from '../../../assets/img/socialLogin/google/logo.png'
import { getNaverTokens, naverProfileRequest } from '../../../services/api/NaverApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  login as getKakaoTokens,
  getProfile as getKakaoProfile,
} from "@react-native-seoul/kakao-login";

const LoginScreen = ({ navigation }) => {
  const { setIsLoggedIn, loading, setLoading } = useAuth();
  const { bgThemedColor } = useTheme();
  const [ formValue, setFormValue ] = useState({
    username: '',
    password: '',
  });
  const [ saveLoginInfo, setSaveLoginInfo ] = useState(false);
  const [ errorDescription, setErrorDescription ] = useState(null);
  const passwordInputRef = useRef(null);

  async function handleAfterLogin () {
    // Backend 서버에 Firebase Cloud Messaging Token 등록
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      try {
        await enrollFCMTokenRequest(fcmToken, 'android');
      } catch (error) {
        logJson(error.response, true);
      }
    }

    fetchPersonalInfo().then(() => {
      setFormValue({ username: '', password: '' });
      setSaveLoginInfo(false);
      setLoading(false);
      setIsLoggedIn(true);
      navigation.navigate('Home');
    });
  }

  async function handleLoginInfo (
    access_token,
    refresh_token,
    access_token_expire_at,
    refresh_token_expire_at,
    socialAccssToken,
    socialRefreshToken,
    login_method='server',
  ) {
    setLoading(true);

    if (!access_token || !refresh_token) {
      setLoading(false);
      return { isSuccess: false, message: 'Failed to login - !access_token' };
    }
  
    const saveTokenResult = await saveTokens(
      access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
    );
    if (!saveTokenResult.isSuccess) {
      setLoading(false);
      return { isSuccess: false, message: 'Failed to save tokens' };
    }

    if (login_method != 'server') {
      const socialTokenName = `${login_method}_login_tokens`;
      const saveSocialTokenResult = await saveSocialLoginTokens(socialTokenName, socialAccssToken, socialRefreshToken);
      if (!saveSocialTokenResult.isSuccess) {
        setLoading(false);
        return { isSuccess: false, message: 'Failed to save tokens' };
      }
    }

    return { isSuccess: true };
  }

  async function naverLogin () {
    const tokens = await getNaverTokens();
    const socialAccssToken = tokens.accessToken;
    const socialRefreshToken = tokens.refreshToken;
    const profileData = await naverProfileRequest(socialAccssToken);

    try {
      // 소셜 로그인 서버 요청
      const serverSocialLoginResponse = await socialLoginRequest('naver', socialAccssToken);
      const {
        access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
      } = serverSocialLoginResponse.data;
      const tokenHandleResult = await handleLoginInfo(
        access_token,
        refresh_token,
        access_token_expire_at,
        refresh_token_expire_at,
        socialAccssToken,
        socialRefreshToken,
        'naver'
      );
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'naver');

      handleAfterLogin();
    } catch (error) {
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('naver', serverAccessToken, randomNick);
          const {
            access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
          } = serverSocialSignupResponse.data;
          const tokenHandleResult = await handleLoginInfo(
            access_token,
            refresh_token,
            access_token_expire_at,
            refresh_token_expire_at,
            socialAccssToken,
            socialRefreshToken,
            'naver'
          );
          if (!tokenHandleResult.isSuccess) {
            console.error(tokenHandleResult.message);
            return;
          }

          AsyncStorage.setItem('login_method', 'naver');

          handleAfterLogin();
        } catch (error) {
          console.error("Naver signup failed", error);
        }
      } else {
        console.error("Naver login failed", error);
      }
    }
  }

  async function kakaoLogin () {
    const tokens = await getKakaoTokens();
    const socialAccssToken = tokens.accessToken;
    const socialRefreshToken = tokens.refreshToken;
    const profileData = await getKakaoProfile();

    try {
      // 소셜 로그인 서버 요청
      const serverSocialLoginResponse = await socialLoginRequest('kakao', socialAccssToken);
      const {
        access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
      } = serverSocialLoginResponse.data;
      const tokenHandleResult = await handleLoginInfo(
        access_token,
        refresh_token,
        access_token_expire_at,
        refresh_token_expire_at,
        socialAccssToken,
        socialRefreshToken,
        'kakao'
      );
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'kakao');

      handleAfterLogin();
    } catch (error) {
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('kakao', serverAccessToken, randomNick);
          const {
            access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
          } = serverSocialSignupResponse.data;
          const tokenHandleResult = await handleLoginInfo(
            access_token,
            refresh_token,
            access_token_expire_at,
            refresh_token_expire_at,
            socialAccssToken,
            socialRefreshToken,
            'kakao'
          );
          if (!tokenHandleResult.isSuccess) {
            console.error(tokenHandleResult.message);
            return;
          }

          AsyncStorage.setItem('login_method', 'kakao');

          handleAfterLogin();
        } catch (error) {
          console.error("Kakao signup failed", error);
        }
      } else {
        console.error("Kakao login failed", error);
      }
    }
  }

  async function googleLogin () {
    let socialAccssToken;

    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    });

    const hasPlayService = GoogleSignin.hasPlayServices();
    if (!hasPlayService) {
      console.error("Google Play Services are not available");
      return;
    }

    const userInfo = await GoogleSignin.signIn();
    if (userInfo){
      const tokens = await GoogleSignin.getTokens();
      socialAccssToken = tokens.accessToken;
    }

    try {
      // 소셜 로그인 서버 요청
      const serverSocialLoginResponse = await socialLoginRequest('google', socialAccssToken);
      const {
        access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
      } = serverSocialLoginResponse.data;
      const tokenHandleResult = await handleLoginInfo(
        access_token,
        refresh_token,
        access_token_expire_at,
        refresh_token_expire_at,
        socialAccssToken,
        'empty',
        'google'
      );
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'google');

      handleAfterLogin();
    } catch (error) {
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('google', serverAccessToken, randomNick);
          const {
            access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
          } = serverSocialSignupResponse.data;
          const tokenHandleResult = await handleLoginInfo(
            access_token,
            refresh_token,
            access_token_expire_at,
            refresh_token_expire_at,
            socialAccssToken,
            'empty',
            'google'
          );
          if (!tokenHandleResult.isSuccess) {
            console.error(tokenHandleResult.message);
            return;
          }

          AsyncStorage.setItem('login_method', 'google');

          handleAfterLogin();
        } catch (error) {
          console.error("Google signup failed", error);
        }
      } else {
        console.error("Google login failed", error);
      }
    }
  }
  async function login () {
    try {
      const response = await loginRequest(formValue.username, formValue.password);
      const {
        access_token, refresh_token, access_token_expire_at, refresh_token_expire_at
      } = response.data;
      const tokenHandleResult = await handleLoginInfo(
        access_token,
        refresh_token,
        access_token_expire_at,
        refresh_token_expire_at
      );
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'server');

      await saveLoginPreferences({ saveLoginInfo });
      if (saveLoginInfo) {
        await saveCredentials(formValue.username, formValue.password);
      }

      handleAfterLogin();
    } catch (error) {
      setErrorDescription(error.response.data.error.description);
    }
  }

  const fillExistingCredentials = async () => {
    const preferences = await getLoginPreferences();
    if (!preferences || !preferences.saveLoginInfo) {
      return;
    }
    
    const storedCredentials = await getCredentials();
    if (storedCredentials) {
      setSaveLoginInfo(preferences.saveLoginInfo);
      setFormValue({
        username: storedCredentials.username,
        password: storedCredentials.password,
      });
      // 필요시 자동 로그인 로직 추가
    }
  };

  useEffect(() => {
    fillExistingCredentials();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, bgThemedColor]}>
        <HeaderBackwardArrow navigation={navigation} />
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="아이디 입력"
            placeholderTextColor="#999"
            required
            value={formValue.username}
            onChangeText={(text) => handleInputChange('username', text, setFormValue)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#999"
            secureTextEntry
            required
            value={formValue.password}
            onChangeText={(text) => handleInputChange('password', text, setFormValue)}
            returnKeyType="done"
            onSubmitEditing={login}
          />
          {errorDescription ? <Text style={styles.errorText}>{errorDescription}</Text> : null}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={saveLoginInfo}
              onValueChange={setSaveLoginInfo}
              tintColors={{ false: Colors.checkbox_border }}
            />
            <TouchableWithoutFeedback onPress={() => setSaveLoginInfo(!saveLoginInfo)}>
              <Text style={styles.label}>로그인 정보 저장</Text>
            </TouchableWithoutFeedback>
          </View>
          <TouchableOpacity style={loading ? styles.loginButtonLoading : styles.loginButton } onPress={login} disabled={loading}>
            {loading
              ? <ActivityIndicator size="small" />
              : <Text style={styles.loginButtonText}>로그인</Text>
            }
          </TouchableOpacity>
          <View style={styles.socialLoginGroupContainer}>
            <TouchableOpacity
              onPress={naverLogin}
              disabled={loading}
              accessible={true}
              accessibilityLabel="네이버 로그인"
              accessibilityRole="button"
            >
              <Image source={naverLogoCircle} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={kakaoLogin}
              disabled={loading}
              accessible={true}
              accessibilityLabel="카카오 로그인"
              accessibilityRole="button"
            >
              <Image source={kakaoLogo} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={googleLogin}
              disabled={loading}
              accessible={true}
              accessibilityLabel="구글 로그인"
              accessibilityRole="button"
            >
              <Image source={googleLogo} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('회원가입')} disabled={loading}>
            <Text style={styles.forgotPassword}>계정이 없으신가요? 회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = new Styles.LoginScreen();

export default LoginScreen;
