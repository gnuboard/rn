import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableWithoutFeedback,
  TouchableOpacity, Keyboard, StyleSheet, Image, ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import {
  loginRequest, socialLoginRequest, socialSignupRequest
} from '../../../services/api/ServerApi';
import { fetchPersonalInfo, handleInputChange } from '../../../utils/componentsFunc';
import { logJson } from '../../../utils/logFunc';
import {
  saveCredentials, saveTokens, saveLoginPreferences, getLoginPreferences,
  getCredentials, saveSocialLoginTokens, getRandomNick
} from '../../../utils/authFunc';
import { useAuth } from '../../../context/auth/AuthContext';
import { Colors } from '../../../constants/theme';
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
  const [ formValue, setFormValue ] = useState({
    username: '',
    password: '',
  });
  const [ saveLoginInfo, setSaveLoginInfo ] = useState(false);
  const passwordInputRef = useRef(null);

  async function handleAfterLogin () {
    fetchPersonalInfo().then(() => {
      setLoading(false);
      setIsLoggedIn(true);
      setFormValue({ username: '', password: '' });
      setSaveLoginInfo(false);
      navigation.navigate('Home');
    });
  }

  async function handleTokens (
    access_token,
    refresh_token,
    socialAccssToken,
    socialRefreshToken,
    login_method='server',
  ) {
    setLoading(true);

    if (!access_token || !refresh_token) {
      setLoading(false);
      return { isSuccess: false, message: 'Failed to login - !access_token' };
    }
  
    const saveTokenResult = await saveTokens(access_token, refresh_token);
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
      const { access_token, refresh_token } = serverSocialLoginResponse.data;
      const tokenHandleResult = await handleTokens(access_token, refresh_token, socialAccssToken, socialRefreshToken, 'naver');
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'naver');
      AsyncStorage.setItem('mb_id', profileData.id);
      AsyncStorage.setItem('mb_email', profileData.email);

      handleAfterLogin();
    } catch (error) {
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('naver', serverAccessToken, randomNick);
          const { access_token, refresh_token } = serverSocialSignupResponse.data;
          const tokenHandleResult = await handleTokens(access_token, refresh_token, socialAccssToken, socialRefreshToken, 'naver');
          if (!tokenHandleResult.isSuccess) {
            console.error(tokenHandleResult.message);
            return;
          }

          AsyncStorage.setItem('login_method', 'naver');
          AsyncStorage.setItem('mb_id', profileData.id);
          AsyncStorage.setItem('mb_email', profileData.email);

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
      const { access_token, refresh_token } = serverSocialLoginResponse.data;
      const tokenHandleResult = await handleTokens(access_token, refresh_token, socialAccssToken, socialRefreshToken, 'kakao');
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'kakao');
      AsyncStorage.setItem('mb_id', profileData.id);

      handleAfterLogin();
    } catch (error) {
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('kakao', serverAccessToken, randomNick);
          const { access_token, refresh_token } = serverSocialSignupResponse.data;
          const tokenHandleResult = await handleTokens(access_token, refresh_token, socialAccssToken, socialRefreshToken, 'kakao');
          if (!tokenHandleResult.isSuccess) {
            console.error(tokenHandleResult.message);
            return;
          }

          AsyncStorage.setItem('login_method', 'kakao');
          AsyncStorage.setItem('mb_id', profileData.id);

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
      const { access_token, refresh_token } = serverSocialLoginResponse.data;
      const tokenHandleResult = await handleTokens(access_token, refresh_token, socialAccssToken, 'empty', 'google');
      if (!tokenHandleResult.isSuccess) {
        console.error(tokenHandleResult.message);
        return;
      }

      AsyncStorage.setItem('login_method', 'google');
      AsyncStorage.setItem('mb_id', userInfo.data.user.id);
      AsyncStorage.setItem('mb_email', userInfo.data.user.email);

      handleAfterLogin();
    } catch (error) {
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('google', serverAccessToken, randomNick);
          const { access_token, refresh_token } = serverSocialSignupResponse.data;
          const tokenHandleResult = await handleTokens(access_token, refresh_token, socialAccssToken, 'empty', 'google');
          if (!tokenHandleResult.isSuccess) {
            console.error(tokenHandleResult.message);
            return;
          }

          AsyncStorage.setItem('login_method', 'google');
          AsyncStorage.setItem('mb_id', userInfo.data.user.id);
          AsyncStorage.setItem('mb_email', userInfo.data.user.email);

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
      const { access_token, refresh_token } = response.data;
      const tokenHandleResult = await handleTokens(access_token, refresh_token);
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
      logJson(error.response, true);
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
      <View style={styles.container}>
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
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={saveLoginInfo}
              onValueChange={setSaveLoginInfo}
              tintColors={{ false: Colors.checkbox_border }}
            />
            <Text style={styles.label}>로그인 정보 저장</Text>
          </View>
          <TouchableOpacity style={loading ? styles.loginButtonLoading : styles.loginButton } onPress={login} disabled={loading}>
            {loading
              ? <ActivityIndicator size="small" />
              : <Text style={styles.loginButtonText}>로그인</Text>
            }
          </TouchableOpacity>
          <View style={styles.socialLoginGroupContainer}>
            <TouchableOpacity onPress={naverLogin} disabled={loading}>
              <Image source={naverLogoCircle} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity onPress={kakaoLogin} disabled={loading}>
              <Image source={kakaoLogo} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity onPress={googleLogin} disabled={loading}>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 2,
    zIndex: 1,
    padding: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '80%',
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 3,
    width: '100%',
    color: Colors.text_black,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 2,
    color: Colors.text_black,
  },
  loginButton: {
    backgroundColor: Colors.btn_blue,
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
    width: '100%',
  },
  loginButtonLoading: {
    backgroundColor: Colors.btn_gray,
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
    width: '100%',
  },
  socialLoginGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  socialLoginLogo: {
    width: 35,
    height: 35,
  },
  loginButtonText: {
    color: Colors.btn_text_white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: Colors.btn_blue,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
  },
});

export default LoginScreen;
