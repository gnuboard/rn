import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, TextInput, View,
  Dimensions, TouchableOpacity, Text, Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import { fetchBoardConfigRequest, createWriteRequest, updateWriteRequest } from '../../../services/api/ServerApi';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import { useAuth } from '../../../context/auth/AuthContext';
import { Colors } from '../../../constants/theme';

const WriteUpdateScreen = ({ navigation, route }) => {
  const { isLoggedIn } = useAuth();
  const [ boardInfoRequested, setBoardInfoRequested ] = useState(false);
  const [ boardInfo, setBoardInfo ] = useState({
    bo_use_category: 0,
    bo_category_list: '',
    bo_upload_count: 0,
  });
  const [ formValue, setFormValue ] = useState({
    ca_name: '',
    wr_name: '',
    wr_password: '',
    wr_email: '',
    wr_homepage: '',
    notice: false,
    secret: false,
    wr_subject: '',
    wr_link1: '',
    wr_link2: '',
  });

  useEffect(() => {
    fetchBoardConfigRequest(route.params.bo_table)
      .then(response => {
        setBoardInfo({
          bo_use_category: response.data.bo_use_category,
          bo_category_list: response.data.bo_category_list != "" ? response.data.bo_category_list.split('|') : [],
          bo_upload_count: response.data.bo_upload_count,
        });
        setBoardInfoRequested(true);
      })
      .catch(error => console.error('fetchBoardConfigReques - CKEditorForm', error));
  }, [boardInfoRequested]);

  const handleFormSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formValue);
  };

  return (
    <View style={styles.container}>
      <HeaderBackwardArrow navigation={navigation} />
      <ScrollView style={styles.scrollContainer}>
        {boardInfo.bo_use_category === 1 && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formValue.ca_name}
              onValueChange={
                (itemValue, itemIndex) => setFormValue({
                  ...formValue,
                  ca_name: itemValue
                })
              }
            >
              <Picker.Item label="분류" value="" />
              {boardInfo.bo_category_list.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>
        )}
        {!isLoggedIn && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.innerInput]}
              placeholder="이름"
              value={formValue.wr_name}
              onChangeText={text => setFormValue({ ...formValue, wr_name: text })}
            />
            <TextInput
              style={[styles.input, styles.innerInput]}
              placeholder="비밀번호"
              secureTextEntry={true}
              value={formValue.wr_password}
              onChangeText={text => setFormValue({ ...formValue, wr_password: text })}
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.innerInput]}
            placeholder="이메일"
            value={formValue.wr_email}
            onChangeText={text => setFormValue({ ...formValue, wr_email: text })}
          />
          <TextInput
            style={[styles.input, styles.innerInput]}
            placeholder="홈페이지"
            value={formValue.wr_homepage}
            onChangeText={text => setFormValue({ ...formValue, wr_homepage: text })}
          />
        </View>
        <View style={styles.checkBoxContainer}>
          {isLoggedIn && (
            <View style={styles.checkboxInnerContainer}>
              <CheckBox
                name="notice"
                value={formValue.notice}
                onValueChange={() => setFormValue({ ...formValue, notice: !formValue.notice })}
              />
              <Text>공지글</Text>
            </View>
          )}
          <View style={styles.checkboxInnerContainer}>
            <CheckBox
              name="secret"
              value={formValue.secret}
              onValueChange={() => setFormValue({ ...formValue, secret: !formValue.secret })}
            />
            <Text>비밀글</Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="제목"
          value={formValue.wr_subject}
          onChangeText={text => setFormValue({ ...formValue, wr_subject: text })}
        />
        <CKEditorForm
          navigation={navigation}
          bo_table={route.params.bo_table}
          write={route.params.write}
        />
        <TextInput
          style={styles.input}
          placeholder="링크 #1"
          value={formValue.wr_link1}
          onChangeText={text => setFormValue({ ...formValue, wr_link1: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="링크 #2"
          value={formValue.wr_link2}
          onChangeText={text => setFormValue({ ...formValue, wr_link2: text })}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={() => (
              Alert.alert(
                '작성취소',
                '작성을 취소하시겠습니까?',
                [
                  {
                    text: '취소',
                    style: 'cancel'
                  },
                  {
                    text: '확인',
                    onPress: () => navigation.goBack()
                  }
                ]
              )
            )}
          >
            <Text style={styles.buttnText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSubmit]}
            onPress={handleFormSubmit}
          >
            <Text style={styles.buttnText}>작성완료</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const CKEditorForm = ({ navigation, bo_table, write }) => {
  const webViewRef = useRef(null);
  const { writeRefresh, setWriteRefresh } = useWriteRefresh();
  const { refreshWriteList } = useWriteListRefresh();

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
  };

  const handleMessage = async (event) => {
    try {
      const eventData = event.nativeEvent.data;
      if (eventData === 'undefined') {
        return;
      }

      const message = JSON.parse(eventData);
      switch (message.type) {
        case 'ready':
          if (!write) {
            break;
          }

          setContent(write.wr_content);
          break;
        case 'submit':
          console.log("submmited~~~~~")
          if (!message.data.wr_content) {
            alert('내용을 입력해주세요.');
            return;
          }
          if (!write) {
            // 새게시글 작성
            try {
              const response = await createWriteRequest(bo_table, message.data);
              if (response.status === 200) {
                const wr_id = response.data.wr_id;
                await refreshWriteList(bo_table);
                navigation.navigate(
                  'Boards',
                  {
                    screen: 'Write',
                    params: { bo_table, wr_id },
                    initial: false,
                  }
                );
              }
            } catch (error) {
              console.error('Error creating new write:', error.response);
            }
          } else {
            // 게시글 수정
            try {
              const response = await updateWriteRequest(bo_table, write.wr_id, message.data);
              if (response.status === 200) {
                setWriteRefresh(!writeRefresh);
                await refreshWriteList(bo_table);
                navigation.goBack();
              }
            } catch (error) {
              if (error.response.status === 403) {
                alert(error.response.data.detail);
              } else {
                console.error('Error updating write:', error);
              }
            }
          }
          break
        case 'error':
          console.error('ERROR from CKEditor:', message);
          break;
        default:
          console.log('Received message from CKEditor:', message);
      }
    } catch (error) {
      console.error('Error parsing event data:', error);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'file:///android_asset/editor_form/ckeditor_form.html' }}
      onMessage={handleMessage}
      style={styles.webViewContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    width: '100%',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 20,
    contentContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  innerInput: {
    width: '48%',
  },
  webViewContainer: {
    height: Dimensions.get('window').height * 0.5,
    width: '100%',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: Colors.btn_gray,
  },
  buttonSubmit: {
    backgroundColor: Colors.btn_blue,
  },
  buttnText: {
    color: Colors.btn_text_white,
    fontWeight: 'bold',
  },
});

export default WriteUpdateScreen;