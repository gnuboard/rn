import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableWithoutFeedback,
  TouchableOpacity, Keyboard, StyleSheet, Image
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
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
import { getNaverTokens, naverProfileRequest } from '../../../services/api/NaverApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  login as getKakaoTokens,
  getProfile as getKakaoProfile,
} from "@react-native-seoul/kakao-login";

const LoginScreen = ({ navigation }) => {
  const { setIsLoggedIn } = useAuth();
  const [ formValue, setFormValue ] = useState({
    username: '',
    password: '',
  });
  const [saveLoginInfo, setSaveLoginInfo] = useState(false);
  const passwordInputRef = useRef(null);

  async function naverLogin () {
    let socialAccssToken;
    let socialRefreshToken;
    try {
      const tokens = await getNaverTokens();
      socialAccssToken = tokens.accessToken;
      socialRefreshToken = tokens.refreshToken;
      const profileData = await naverProfileRequest(socialAccssToken);

      // 소셜 로그인 서버 요청
      const serverSocialLoginResponse = await socialLoginRequest('naver', socialAccssToken);
      const { access_token, refresh_token } = serverSocialLoginResponse.data;
      if (!access_token) {
        console.error('Failed to login - !access_token');
        return;
      }

      const saveTokenResult = await saveTokens(access_token, refresh_token);
      if (!saveTokenResult.isSuccess) {
        console.error('Failed to save tokens');
        return;
      }

      const saveSocialTokenResult = await saveSocialLoginTokens('naver_login_tokens', socialAccssToken, socialRefreshToken);
      if (!saveSocialTokenResult.isSuccess) {
        console.error('Failed to save tokens');
        return;
      }

      AsyncStorage.setItem('login_method', 'naver');
      AsyncStorage.setItem('mb_id', profileData.id);
      AsyncStorage.setItem('mb_email', profileData.email);

      fetchPersonalInfo().then(() => {
        setIsLoggedIn(true);
        setFormValue({ username: '', password: '' });
        setSaveLoginInfo(false);
        navigation.navigate('Home');
      });
    } catch (error) {
      console.error("Naver login failed", error);
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('naver', serverAccessToken, randomNick);
          const { access_token, refresh_token } = serverSocialSignupResponse.data;
          if (!access_token) {
            console.error('Failed to signup - !access_token');
            return;
          }

          const saveTokenResult = await saveTokens(access_token, refresh_token);
          if (!saveTokenResult.isSuccess) {
            console.error('Failed to save tokens');
            return;
          }

          const saveSocialTokenResult = await saveSocialLoginTokens('naver_login_tokens', socialAccssToken, socialRefreshToken);
          if (!saveSocialTokenResult.isSuccess) {
            console.error('Failed to save tokens');
            return;
          }

          AsyncStorage.setItem('login_method', 'naver');
          AsyncStorage.setItem('mb_id', profileData.id);
          AsyncStorage.setItem('mb_email', profileData.email);

          fetchPersonalInfo().then(() => {
            setIsLoggedIn(true);
            setFormValue({ username: '', password: '' });
            setSaveLoginInfo(false);
            navigation.navigate('Home');
          });
        } catch (error) {
          console.error("Naver signup failed", error);
        }
      }
    }
  }

  async function kakaoLogin () {
    let socialAccssToken;
    let socialRefreshToken;
    try {
      const tokens = await getKakaoTokens();
      socialAccssToken = tokens.accessToken;
      socialRefreshToken = tokens.refreshToken;
      const profileData = await getKakaoProfile();

      // 소셜 로그인 서버 요청
      const serverSocialLoginResponse = await socialLoginRequest('kakao', socialAccssToken);
      const { access_token, refresh_token } = serverSocialLoginResponse.data;
      if (!access_token) {
        console.error('Failed to login - !access_token');
        return;
      }

      const saveTokenResult = await saveTokens(access_token, refresh_token);
      if (!saveTokenResult.isSuccess) {
        console.error('Failed to save tokens');
        return;
      }

      const saveSocialTokenResult = await saveSocialLoginTokens('kakao_login_tokens', socialAccssToken, socialRefreshToken);
      if (!saveSocialTokenResult.isSuccess) {
        console.error('Failed to save tokens');
        return;
      }

      AsyncStorage.setItem('login_method', 'kakao');
      AsyncStorage.setItem('mb_id', profileData.id);

      setIsLoggedIn(true);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Kakao login failed", error);
      if (error.response.data.statusCode === 404 && error.response.data.error.type === "user not found") {
        const randomNick = getRandomNick(6);
        const serverAccessToken = error.response.data.token;

        // 소셜 회원가입 서버 요청
        try {
          const serverSocialSignupResponse = await socialSignupRequest('kakao', serverAccessToken, randomNick);
          const { access_token, refresh_token } = serverSocialSignupResponse.data;
          if (!access_token) {
            console.error('Failed to signup - !access_token');
            return;
          }

          const saveTokenResult = await saveTokens(access_token, refresh_token);
          if (!saveTokenResult.isSuccess) {
            console.error('Failed to save tokens');
            return;
          }

          const saveSocialTokenResult = await saveSocialLoginTokens('kakao_login_tokens', socialAccssToken, socialRefreshToken);
          if (!saveSocialTokenResult.isSuccess) {
            console.error('Failed to save tokens');
            return;
          }

          AsyncStorage.setItem('login_method', 'kakao');
          AsyncStorage.setItem('mb_id', profileData.id);

          fetchPersonalInfo().then(() => {
            setIsLoggedIn(true);
            setFormValue({ username: '', password: '' });
            setSaveLoginInfo(false);
            navigation.navigate('Home');
          });
        } catch (error) {
          console.error("Kakao signup failed", error);
        }
      }
    }
  }

  async function login () {
    try {
      const response = await loginRequest(formValue.username, formValue.password);
      const { access_token, refresh_token } = response.data;
      if (!access_token) {
        console.error('Failed to login - !access_token');
        return;
      }

      const saveTokenResult = await saveTokens(access_token, refresh_token);
      if (!saveTokenResult.isSuccess) {
        console.error('Failed to save tokens');
        return;
      }

      await saveLoginPreferences({ saveLoginInfo });
      if (saveLoginInfo) {
        await saveCredentials(formValue.username, formValue.password);
      }

      fetchPersonalInfo().then(() => {
        setIsLoggedIn(true);
        setFormValue({ username: '', password: '' });
        setSaveLoginInfo(false);
        navigation.navigate('Home');
      });
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
          <TouchableOpacity style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <View style={styles.socialLoginGroupContainer}>
            <TouchableOpacity onPress={naverLogin}>
              <Image source={naverLogoCircle} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity onPress={kakaoLogin}>
              <Image source={kakaoLogo} style={styles.socialLoginLogo} resizeMode="cover" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('회원가입')}>
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
