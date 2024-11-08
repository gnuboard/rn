import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TouchableWithoutFeedback,
  Keyboard, ScrollView
} from 'react-native';
import { Agreement, SignupForm } from '../../../components/Auth/Signup/SignupForm';
import { Styles } from '../../../styles/styles';
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
          <TouchableOpacity
            style={[styles.button, styles.snsButton]}
            onPress={() => navigation.navigate('로그인')}
          >
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

const styles = new Styles.SignupScreen();

export default SignupScreen;