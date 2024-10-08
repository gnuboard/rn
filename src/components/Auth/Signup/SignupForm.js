import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, TouchableWithoutFeedback, Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { signupRequest } from '../../../services/api/ServerApi';
import { Colors } from '../../../constants/theme';

export const Agreement = ({ 
  allAgreed, setAllAgreed, policySignup, setPolicySignup, policyPrivacy, setPolicyPrivacy
 }) => {

  useEffect(() => {
    agreeAllAuto();
  }, [policySignup, policyPrivacy]);

  const toggleAll = (value) => {
    setAllAgreed(value);
    setPolicySignup(value);
    setPolicyPrivacy(value);
  };

  const agreeAllAuto = () => {
    if (policySignup && policyPrivacy) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }

  return (
    <View style={styles.agreementContainer}>
      <Text style={styles.sectionTitle}>회원가입약관</Text>
      <ScrollView style={styles.agreementScroll}>
        <Text style={styles.agreementText}>
          제13조 재화 등의 공급
          1. "플랫폼"은 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, "플랫폼"이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에 조치를 취합니다. 이때 "플랫폼"은 이용자가 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.
        </Text>
      </ScrollView>
      <View style={styles.checkboxContainer}>
        <CheckBox
          style={styles.checkbox}
          value={policySignup}
          onValueChange={setPolicySignup}
          tintColors={{ false: Colors.checkbox_border }}
        />
        <TouchableWithoutFeedback onPress={() => setPolicySignup(!policySignup)}>
          <Text style={styles.label}>회원가입약관에 동의합니다.</Text>
        </TouchableWithoutFeedback>
      </View>
      
      <Text style={styles.sectionTitle}>개인정보처리방침</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>목적</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>항목</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>보유기간</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>이용자 식별 및 본인여부 확인</Text>
          <Text style={styles.tableCell}>아이디, 이름, 비밀번호</Text>
          <Text style={styles.tableCell}>회원 탈퇴시 까지</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>서비스 이용에 관한 통지, CS대응을 위한 이용자 식별</Text>
          <Text style={styles.tableCell}>연락처 (이메일, 휴대전화 번호)</Text>
          <Text style={styles.tableCell}>회원 탈퇴시 까지</Text>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={policyPrivacy}
          onValueChange={setPolicyPrivacy}
          tintColors={{ false: Colors.checkbox_border }}
        />
        <TouchableWithoutFeedback onPress={() => setPolicyPrivacy(!policyPrivacy)}>
          <Text style={styles.label}>개인정보처리방침에 동의합니다.</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={allAgreed}
          onValueChange={toggleAll}
          tintColors={{ false: Colors.checkbox_border }}
        />
        <TouchableWithoutFeedback onPress={() => toggleAll(!allAgreed)}>
          <Text style={styles.label}>위 내용에 모두 동의합니다.</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export const SignupForm = ({ navigation }) => {
  const initalFormData = {
    mb_id: '',
    mb_password: '',
    mb_password_re: '',
    mb_name: '',
    mb_nick: '',
    mb_name: '',
    mb_email: '',
    mb_mailling: false,
    mb_open: false,
  };

  const mbIdRef = useRef(null);
  const mbPasswordRef = useRef(null);
  const mbPasswordReRef = useRef(null);
  const mbEmailRef = useRef(null);
  const [ formData, setFormData ] = useState(initalFormData);
  const [ isSignupLoading, setIsSignupLoading ] = useState(false);
  const [ idError, setIdError ] = useState('');
  const [ emailError, setEmailError ] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSignupLoading(true);
    setIdError('');
    setEmailError('');
    try {
      const response = await signupRequest(formData);
      if (response.status === 200) {
        setFormData(initalFormData);
        Alert.alert(
          "Confirmation",
          response.data.message,
          [
            { 
              text: "OK", 
              onPress: () => {
                navigation.navigate('로그인');
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        alert(response.status);
      }
    } catch (error) {
      console.error('Error creating member:', error);
      if (error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          for (let detail of error.response.data.detail) {
            alert(detail.msg);
          }
        } else {
          const errorMsg = error.response.data.detail;
          if (errorMsg == "이미 가입된 아이디입니다.") {
            setIdError(errorMsg);
          } else if (errorMsg == "이미 가입된 이메일입니다.") {
            setEmailError(errorMsg);
          }
        }
      } else {
        alert(error);
      }
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>사이트 이용정보 입력</Text>
      <TextInput
        ref={mbIdRef}
        style={styles.input}
        placeholder="아이디 (필수)*"
        placeholderTextColor={Colors.text_placeholder_black}
        value={formData.mb_id}
        onChangeText={(text) => {
          handleInputChange('mb_id', text);
          handleInputChange('mb_nick', text);
          handleInputChange('mb_name', text);
        }}
        returnKeyType="next"
        onSubmitEditing={() => mbPasswordRef.current.focus()}
      />
      {idError && <Text style={styles.errorText}>{idError}</Text>}
      <TextInput
        ref={mbPasswordRef}
        style={styles.input}
        placeholder="비밀번호 (필수)*"
        placeholderTextColor={Colors.text_placeholder_black}
        secureTextEntry
        value={formData.mb_password}
        onChangeText={(text) => handleInputChange('mb_password', text)}
        returnKeyType="next"
        onSubmitEditing={() => mbPasswordReRef.current.focus()}
      />
      <TextInput
        ref={mbPasswordReRef}
        style={styles.input}
        placeholder="비밀번호 확인 (필수)*"
        placeholderTextColor={Colors.text_placeholder_black}
        secureTextEntry
        value={formData.mb_password_re}
        onChangeText={(text) => handleInputChange('mb_password_re', text)}
        returnKeyType="next"
        onSubmitEditing={() => mbEmailRef.current.focus()}
      />

      <TextInput
        ref={mbEmailRef}
        style={styles.input}
        placeholder="E-mail (필수)*"
        placeholderTextColor={Colors.text_placeholder_black}
        value={formData.mb_email}
        onChangeText={(text) => handleInputChange('mb_email', text)}
        keyboardType="email-address"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <Text style={styles.sectionTitle}>기타 개인정보 설정</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox
          name="mb_mailing"
          value={formData.mb_mailling}
          onValueChange={() => handleInputChange('mb_mailling', !formData.mb_mailling)}
          tintColors={{ false: Colors.checkbox_border }}
        />
        <Text style={styles.label}>정보 메일을 받겠습니다.</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          name="mb_open"
          value={formData.mb_open}
          onValueChange={() => handleInputChange('mb_open', !formData.mb_open)}
          tintColors={{ false: Colors.checkbox_border }}
        />
        <Text style={styles.label}>
          다른분들이 나의 정보를 {'\n'}볼 수 있도록 합니다.
        </Text>
      </View>
      <TouchableOpacity style={[styles.button, isSignupLoading && styles.disabledButton]} onPress={handleSubmit} disabled={isSignupLoading}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  
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
    marginBottom: 15,
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
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
  },
  agreementContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  snsButton: {
    backgroundColor: '#4267B2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.text_black,
  },
  agreementScroll: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  agreementText: {
    fontSize: 13,
    color: Colors.text_black,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 12,
    color: Colors.text_black,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    borderColor: Colors.text_black,
    borderWidth: 1,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text_black,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});