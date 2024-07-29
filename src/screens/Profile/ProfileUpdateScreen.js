import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { HeaderBackwardArrow } from '../../components/Common/Arrow';

const ProfileUpdateScreen = ({ navigation, route}) => {
  const profileData = route.params;
  const [formValue, setFormValue] = useState({
    mb_nick: profileData.mb_nick,
    mb_email: profileData.mb_email,
    mb_name: profileData.mb_name,
    mb_hp: '',
    mb_zip: '',
    mb_addr1: '',
    mb_addr2: '',
    mb_profile: profileData.mb_profile,
    mb_open: false,
    mb_alarm: false,
    mb_dummy_data: false,
  });

  const handleChange = (name, value) => {
    setFormValue(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted', formValue);
  };

  return (
    <>
    <HeaderBackwardArrow navigation={navigation} />
    <Text style={styles.title}>SiR</Text>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="별명"
          value={formValue.mb_nick}
          onChangeText={(value) => handleChange('mb_nick', value)}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>자동생성</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        style={styles.input}
        placeholder="이메일 주소"
        value={formValue.mb_email}
        onChangeText={(value) => handleChange('mb_email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={formValue.mb_name}
        onChangeText={(value) => handleChange('mb_name', value)}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="휴대폰번호"
          value={formValue.mb_hp}
          onChangeText={(value) => handleChange('mb_hp', value)}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>인증하기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="우편번호"
          value={formValue.mb_zip}
          onChangeText={(value) => handleChange('mb_zip', value)}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>주소검색</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="기본 주소"
        value={formValue.mb_addr1}
        onChangeText={(value) => handleChange('mb_addr1', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="상세 주소"
        value={formValue.mb_addr2}
        onChangeText={(value) => handleChange('mb_addr2', value)}
      />
      <TouchableOpacity 
        style={styles.fileButton} 
      >
        <Text style={styles.fileButtonText}>
          회원 아이콘: {formValue.itemFile ? formValue.itemFile.name : '선택된 파일 없음'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.fileButton} 
      >
        <Text style={styles.fileButtonText}>
          회원 이미지: {formValue.imageFile ? formValue.imageFile.name : '선택된 파일 없음'}
        </Text>
      </TouchableOpacity>
      <TextInput 
        style={[styles.input, styles.multilineInput]} 
        placeholder="자기소개"
        multiline
        numberOfLines={4}
        value={formValue.mb_profile}
        onChangeText={(value) => handleChange('mb_profile', value)}
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleChange('mb_open', !formValue.mb_open)}
        >
          <View style={[styles.checkboxInner, formValue.mb_open && styles.checkboxChecked]} />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>정보공개 (다른분들이 내정보를 볼수 있습니다)</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleChange('mb_alarm', !formValue.mb_alarm)}
        >
          <View style={[styles.checkboxInner, formValue.mb_alarm && styles.checkboxChecked]} />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>알림설정 (이곳에서 알림을 받을수 있습니다)</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleChange('mb_dummy_data', !formValue.mb_dummy_data)}
        >
          <View style={[styles.checkboxInner, formValue.mb_dummy_data && styles.checkboxChecked]} />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>더미데이터 동의 (내글을 다른분들이 사용할수 있습니다)</Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>수정하기</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    height: 45,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    height: 45,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  fileButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  fileButtonText: {
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfileUpdateScreen;