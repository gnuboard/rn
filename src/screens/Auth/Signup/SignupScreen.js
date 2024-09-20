import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback,
  Keyboard, ScrollView
} from 'react-native';
import { Agreement, SignupForm } from '../../../components/Auth/Signup/SignupForm';
import { Colors } from '../../../constants/theme';
import { useTheme } from '../../../context/theme/ThemeContext';

const SignupScreen = ({ navigation }) => {
  const [ allAgreed, setAllAgreed ] = useState(false);
  const [ policySignup, setPolicySignup ] = useState(false);
  const [ policyPrivacy, setPolicyPrivacy ] = useState(false);
  const [ togglePressed, setTogglePressed ] = useState(false);
  const { bgThemedColor } = useTheme();

  const toggleForm = () => setTogglePressed(!togglePressed);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={[styles.container, bgThemedColor]}>
        <View style={styles.formContainer}>
          {togglePressed ? (
            <SignupForm navigation={navigation} />
          ) : (
            <Agreement
              allAgreed={allAgreed}
              setAllAgreed={setAllAgreed}
              policySignup={policySignup}
              setPolicySignup={setPolicySignup}
              policyPrivacy={policyPrivacy}
              setPolicyPrivacy={setPolicyPrivacy}
            />
          )}
          <TouchableOpacity style={[styles.button, styles.snsButton]}>
            <Text style={styles.snsButtonText}>SNS 계정으로 가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !allAgreed && styles.disabledButton]}
            onPress={toggleForm}
            disabled={!allAgreed}
          >
            <Text style={styles.buttonText}>
              {!togglePressed ? '다음' : '이전'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.outlineButtonText}>취소</Text>
          </TouchableOpacity>
          
        </View>
        
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '100%',
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
  button: {
    backgroundColor: Colors.btn_blue,
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: Colors.btn_text_white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.btn_blue,
    borderWidth: 1,
  },
  outlineButtonText: {
    color: Colors.btn_blue,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  snsButton: {
    backgroundColor: '#4267B2',
    padding: 10,
    borderRadius: 5,
  },
  snsButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SignupScreen;