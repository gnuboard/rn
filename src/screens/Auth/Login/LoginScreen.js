import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import { loginRequest, fetchPersonalInfoRequest } from '../../../services/api/ServerApi';
import { handleInputChange } from '../../../utils/componentsFunc';
import { logJson } from '../../../utils/logFunc';
import { saveCredentials, saveTokens, saveLoginPreferences, getLoginPreferences, getCredentials } from '../../../utils/authFunc';

const LoginScreen = ({ navigation }) => {
  const [ formValue, setFormValue ] = useState({
    username: '',
    password: '',
  });
  const [saveLoginInfo, setSaveLoginInfo] = useState(false);
  const passwordInputRef = useRef(null);

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

      try {
        const meInfoResponse = await fetchPersonalInfoRequest();
        const userData = meInfoResponse.data;
        const keys = Object.keys(userData);
        const promises = keys.map(key => 
          AsyncStorage.setItem(key, JSON.stringify(userData[key]))
        );
        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to fetch personal info');
        logJson(error.response.data, true);
      }

      setFormValue({ username: '', password: '' });
      setSaveLoginInfo(false);
      navigation.navigate('Home');
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
            />
            <Text style={styles.label}>로그인 정보 저장</Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity>
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 2,
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#4a90e2',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
  },
});

export default LoginScreen;
