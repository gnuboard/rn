import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-sharp" size={28} color="#464646" />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="아이디 입력"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#999"
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton}>
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
