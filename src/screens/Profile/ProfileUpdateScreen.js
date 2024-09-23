import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBackwardArrow } from '../../components/Common/Arrow';
import { updatePersonalInfoRequest, updateMbImgRequest } from '../../services/api/ServerApi';
import { logJson } from '../../utils/logFunc';
import { useAuth } from '../../context/auth/AuthContext';
import { useTheme } from '../../context/theme/ThemeContext';
import { fetchPersonalInfo } from '../../utils/componentsFunc';
import { ImageWithDeleteButton } from '../../components/Common/Delete';
import { Colors, emptyAvatarPath, emptyAvatarUri } from '../../constants/theme';
import { getMemberIconUri, getMemberImageUri } from '../../utils/fileFunc';

const ProfileUpdateScreen = ({ navigation, route }) => {
  let imgFormData = new FormData();
  const { setIsLoggedIn } = useAuth();
  const { bgThemedColor, textThemedColor } = useTheme();
  const [ disableEmailInput, setDisableEmailInput ] = useState(true);
  const [ formValue, setFormValue ] = useState({
    mb_nick: route.params.mb_nick,
    mb_email: route.params.mb_email,
    mb_name: route.params.mb_name,
    mb_hp: '',
    mb_zip: '',
    mb_addr_jibeon: '',
    mb_addr1: '',
    mb_addr2: '',
    mb_icon_path: getMemberIconUri(route.params),
    mb_image_path: getMemberImageUri(route.params),
    mb_profile: route.params.mb_profile,
    mb_open: false,
    mb_alarm: false,
    mb_dummy_data: false,
    mb_1: '',
    mb_2: '',
    mb_3: '',
    mb_4: '',
    mb_5: '',
    mb_6: '',
    mb_7: '',
    mb_8: '',
    mb_9: '',
    mb_10: '',
  });
  const [ mbImages, setMbImages ] = useState({
    mb_icon: getMemberIconUri(route.params),
    mb_img: getMemberImageUri(route.params),
    del_mb_icon: 0,
    del_mb_img: 0,
  });
  const [ isSubmitReady, setIsSubmitReady ] = useState(true);
  let retryCount = 0;

  useEffect(() => {
    const setCurrnetLoginMethod = async () => {
      const method = await AsyncStorage.getItem('login_method');
      if (method != 'server' && method != 'kakao') {
        setDisableEmailInput(false);
      }
    }

    setCurrnetLoginMethod();
    if (route.params.zonecode) {
      setFormValue(prevState => ({
        ...prevState,
        mb_zip: route.params.zonecode,
        mb_addr_jibeon: route.params.jibunAddress,
        mb_addr1: route.params.address,
      }));
    }
  }, [route]);

  const handleChange = (name, value) => {
    if (name === 'mb_img_path') {
      name = 'mb_image_path';
    }
    setFormValue(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (name, file) => {
    setMbImages(prevState => ({
      ...prevState,
      [name]: file,
    }));
    if (isEmptyAvatar(file.uri)) {
      handleChange(name + '_path', '선택된 파일 없음');
    } else {
      handleChange(name + '_path', file.uri);
    }
  };

  const handleFilePick = async (fieldName) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      handleChange(fieldName, res[0].name);
      handleFileChange(fieldName, res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const imgSubmitSuccess = await handleImgSubmit();
      if (!imgSubmitSuccess) {
        setIsSubmitReady(false);
        retryCount += 1;
        if (retryCount > 10) {
          setIsSubmitReady(true);
          alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
          return;
        }
        setTimeout(() => {
          imgFormData = new FormData();
          handleSubmit();
        }, 50);
        return;
      }
      const response = await updatePersonalInfoRequest(formValue);
      if (response.status && response.status === 200) {
        fetchPersonalInfo().then(() => {
          setIsLoggedIn(false);
          setIsLoggedIn(true);
        })
        .then(() => {navigation.navigate('Profile')});
      } else {
        console.log("handleSubmit log - ProfileUpdateScreen", response);
      }
    } catch (error) {
      console.error("handleSubmit error - ProfileUpdateScreen", error);
      logJson(error, true);
    }
  };

  const handleImgSubmit = async () => {
    imgFormData.append('del_mb_icon', mbImages.del_mb_icon);
    imgFormData.append('del_mb_img', mbImages.del_mb_img);
    if (mbImages.mb_icon?.uri && mbImages.mb_icon.uri != emptyAvatarUri) {
      imgFormData.append('mb_icon', {
        name: mbImages.mb_icon.name,
        type: mbImages.mb_icon.type,
        uri: mbImages.mb_icon.uri,
      });
    }
    if (mbImages.mb_img?.uri && mbImages.mb_img.uri != emptyAvatarUri) {
      imgFormData.append('mb_img', {
        name: mbImages.mb_img.name,
        type: mbImages.mb_img.type,
        uri: mbImages.mb_img.uri,
      });
    }
    try {
      const response = await updateMbImgRequest(imgFormData);
      if (response.status === 200) {
        return {'imgSubmitSuccess': true}
      }
    } catch (error) {
      if (error.response && error.response.status && error.response.status === 400) {
        alert(error.response.data.error.description);
      } else {
        console.error("handleImgSubmit error - ProfileUpdateScreen", error);
      }
    }
  }

  onDeleteIcon = () => {
    handleChange('mb_icon_path', '');
    setMbImages(prevState => ({
      ...prevState,
      del_mb_icon: 1,
    }));
    handleFileChange('mb_icon', {
      uri: emptyAvatarUri,
    });
  }

  onDeleteImg = () => {
    handleChange('mb_image_path', '');
    setMbImages(prevState => ({
      ...prevState,
      del_mb_img: 1,
    }));
    handleFileChange('mb_img', {
      uri: emptyAvatarUri,
    });
  }

  const DyanamicTouchView = isSubmitReady ? TouchableOpacity : TouchableOpacity;

  return (
    <View style={[styles.container, bgThemedColor]}>
      <HeaderBackwardArrow navigation={navigation} />
      <Text style={[styles.title, textThemedColor]}>SiR</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="별명"
            placeholderTextColor={Colors.text_placeholder_black}
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
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.mb_email}
          onChangeText={(value) => handleChange('mb_email', value)}
          editable={disableEmailInput}
        />
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.mb_name}
          onChangeText={(value) => handleChange('mb_name', value)}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="휴대폰번호"
            placeholderTextColor={Colors.text_placeholder_black}
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
            placeholderTextColor={Colors.text_placeholder_black}
            value={formValue.mb_zip}
            onChangeText={(value) => handleChange('mb_zip', value)}
            editable={false}
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Zip')}>
            <Text style={styles.buttonText}>주소검색</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="기본 주소"
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.mb_addr1}
          onChangeText={(value) => handleChange('mb_addr1', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="상세 주소"
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.mb_addr2}
          onChangeText={(value) => handleChange('mb_addr2', value)}
        />
        <View style={styles.fileContainer}>
          <TouchableOpacity 
            style={styles.fileButton} 
            onPress={() => handleFilePick('mb_icon')}
          >
            <Text style={styles.fileButtonText} numberOfLines={1} ellipsizeMode="tail">
              회원 아이콘: {
                formValue.mb_icon_path
                ? (isEmptyAvatar(formValue.mb_icon_path) ? '선택된 파일 없음' : formValue.mb_icon_path )
                : '선택된 파일 없음'
              }
            </Text>
          </TouchableOpacity>
          {
            mbImages.mb_icon && (
              <ImageWithDeleteButton
                imageUri={mbImages.mb_icon.uri ? mbImages.mb_icon.uri : mbImages.mb_icon}
                onDelete={onDeleteIcon}
              />
            )
          }
        </View>
        <View style={styles.fileContainer}>
          <TouchableOpacity 
            style={styles.fileButton} 
            onPress={() => handleFilePick('mb_img')}
          >
            <Text style={styles.fileButtonText} numberOfLines={1} ellipsizeMode="tail">
              회원 이미지: {
                formValue.mb_image_path
                ? (isEmptyAvatar(formValue.mb_image_path) ? '선택된 파일 없음' : formValue.mb_image_path )
                : '선택된 파일 없음'
              }
            </Text>
          </TouchableOpacity>
          {
            mbImages.mb_img && (
              <ImageWithDeleteButton
                imageUri={mbImages.mb_img.uri ? mbImages.mb_img.uri : mbImages.mb_img}
                onDelete={onDeleteImg}
              />
            )
          }
        </View>
        <TextInput 
          style={[styles.input, styles.multilineInput]} 
          placeholder="자기소개"
          placeholderTextColor={Colors.text_placeholder_black}
          multiline
          numberOfLines={4}
          value={formValue.mb_profile}
          onChangeText={(value) => handleChange('mb_profile', value)}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            style={styles.checkbox}
            value={formValue.mb_open}
            onValueChange={() => handleChange('mb_open', !formValue.mb_open)}
            tintColors={{ false: Colors.checkbox_border }}
          />
          <Text style={[styles.checkboxLabel, textThemedColor]}>정보공개 (다른분들이 내정보를 볼수 있습니다)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            style={styles.checkbox}
            value={formValue.mb_alarm}
            onValueChange={() => handleChange('mb_alarm', !formValue.mb_alarm)}
            tintColors={{ false: Colors.checkbox_border }}
          />
          <Text style={[styles.checkboxLabel, textThemedColor]}>알림설정 (이곳에서 알림을 받을수 있습니다)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleChange('mb_dummy_data', !formValue.mb_dummy_data)}
          >
            <View style={[styles.checkboxInner, formValue.mb_dummy_data && styles.checkboxChecked]} />
          </TouchableOpacity>
          <Text style={[styles.checkboxLabel, textThemedColor]}>더미데이터 동의 (내글을 다른분들이 사용할수 있습니다)</Text>
        </View>
        <DyanamicTouchView disabled={!isSubmitReady} style={[styles.submitButton, !isSubmitReady && styles.disabledButton]} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>수정하기</Text>
        </DyanamicTouchView>
      </ScrollView>
    </View>
  );
};

function isEmptyAvatar(uri) {
  return uri.includes(emptyAvatarPath);
}

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
    color: Colors.text_black,
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
  fileContainer: {
    flexDirection: 'row',
  },
  fileButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
    width: '80%',
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
    backgroundColor: Colors.btn_blue,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
    opacity: 0.6,
  },
});

export default ProfileUpdateScreen;