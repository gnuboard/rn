import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, TextInput, View,
  Dimensions, TouchableOpacity, Text, Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import {
  fetchBoardConfigRequest, createWriteRequest, createGuestWriteRequest,
  updateWriteRequest, uploadFilesRequest, fetchSecretWriteRequest
} from '../../../services/api/ServerApi';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTheme } from '../../../context/theme/ThemeContext';
import { Colors } from '../../../constants/theme';

const WriteUpdateScreen = ({ navigation, route }) => {
  const { isLoggedIn } = useAuth();
  const { bgThemedColor, textThemedColor } = useTheme();
  const webViewRef = useRef(null);
  const { bo_table, write, wr_parent, reply_subject } = route.params;
  const { refreshWriteList } = useWriteListRefresh();
  const { writeRefresh, setWriteRefresh } = useWriteRefresh();
  const [ boardInfoRequested, setBoardInfoRequested ] = useState(false);
  const [ boardInfo, setBoardInfo ] = useState({
    bo_use_category: 0,
    bo_category_list: '',
    bo_upload_count: 0,
  });
  const [ formValue, setFormValue ] = useState({
    ca_name: write ? write.ca_name : '',
    wr_name: write ? write.wr_name : '',
    wr_password: '',
    wr_email: write ? write.wr_email : '',
    wr_homepage: write ? write.wr_homepage : '',
    notice: false,
    secret: write ? write.secret : false,
    wr_subject: write ? write.wr_subject : (reply_subject ? reply_subject : ''),
    wr_content: write ? write.wr_content : '',
    wr_link1: write ? write.wr_link1 : '',
    wr_link2: write ? write.wr_link2 : '',
    wr_parent: wr_parent ? wr_parent : 0,
  });
  const [ uploadFiles, setUploadFiles ] = useState({});
  const uploadedFiles = write ? write.images.concat(write.normal_files) : [];

  useEffect(() => {
    fetchBoardConfigRequest(bo_table)
      .then(response => {
        setBoardInfo({
          bo_use_category: response.data.bo_use_category,
          bo_category_list: response.data.bo_category_list != "" ? response.data.bo_category_list.split('|') : [],
          bo_upload_count: response.data.bo_upload_count,
        });
        setUploadFiles(() => {
            const initialState = {};
            for (let i = 0; i < response.data.bo_upload_count; i++) {
              initialState[`file${i+1}`] = null;
            }
            return initialState;
          }
        );
        setBoardInfoRequested(true);
      })
      .catch(error => console.error('fetchBoardConfigReques - CKEditorForm', error));
  }, [boardInfoRequested]);

  const getContent = async () => {
    // CKEditor에서 작성한 내용을 가져오기
    // handleMessage 내의 submit case에서, 가져와진 내용에 따라 작성/수정 요청을 보낸다.
    webViewRef.current.injectJavaScript(`getEditorContent();`);
  };

  const setContent = async (content) => {
    // 게시글 수정의 경우 write의 wr_content를 CKEditor Form에 주입
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
  };

  const handleWriting = async (message, wr_id) => {
    // wr_id가 있으면 게시글 수정, 없으면 새 게시글 작성
    let wrId = wr_id;
    let response;
    try {
      const dataToSend = {
        ...formValue,
        wr_content: message.data,
        secret: formValue.secret ? "secret": "html1"
      }

      if (!wrId) {
        if (isLoggedIn) {
          response = await createWriteRequest(bo_table, dataToSend);
        } else {
          response = await createGuestWriteRequest(bo_table, dataToSend);
        }
      } else {
        response = await updateWriteRequest(bo_table, wrId, dataToSend);
      }

      if (response.status === 200 || response.status === 201) {
        if (!wrId) {
          wrId = response.data.wr_id;
        }
        const fileFormData = new FormData();
        Object.entries(uploadFiles).forEach(async ([_, value]) => {
          if (value) {
            fileFormData.append('files[]', {
              name: value.name,
              type: value.type,
              uri: value.uri,
            });
          }
        });
        setWriteRefresh(!writeRefresh);
        await refreshWriteList(bo_table);
        if (fileFormData._parts.length) {
          fileFormData.append('wr_password', formValue.wr_password);
          await uploadFilesRequest(bo_table, wrId, fileFormData);
        }

        // 작성된 게시글로 이동하기 위한 params 설정
        let params = { bo_table, wr_id: wrId };
        if (formValue.secret) {
          const secretWriteResponse = await fetchSecretWriteRequest(bo_table, wrId, formValue.wr_password);
          const writeData = secretWriteResponse.data;
          params.isVerified = true;
          params.writeData = writeData;
        }

        navigation.navigate(
          'Boards',
          {
            screen: 'Write',
            params: params,
            initial: false,
          }
        );
      }
    } catch (error) {
      if (error.response) {
        const { error: errorDetails } = error.response.data;
        Alert.alert(
          'Error',
          errorDetails.description,
          [
            {
              text: '확인',
              onPress: () => {
                if (wrId) {
                  navigation.navigate(
                    'Boards',
                    {
                      screen: 'Write',
                      params: { bo_table, wr_id: wrId },
                      initial: false,
                    }
                  )
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error('Error creating new write:', error);
      }
    }
  }

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
          if (!message.data) {
            alert('내용을 입력해주세요.');
            return;
          }
          if (!write) {
            // 새게시글 작성
            handleWriting(message);
          } else {
            // 게시글 수정
            handleWriting(message, write.wr_id);
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

  const handleFilePick = async (fieldName) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setUploadFiles({ ...uploadFiles, [fieldName]: res[0] });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the picker");
      } else {
        throw err;
      }
    }
  };

  const renderUploadFileInputs = () => {
    let uploadFileInputs = [];
    for (let i = 0; i < boardInfo.bo_upload_count; i++) {
      uploadFileInputs.push(
        <TouchableOpacity 
          style={styles.fileButton}
          onPress={() => handleFilePick(`file${i+1}`)}
          key={i}
        >
          <Text style={[styles.fileButtonText]} numberOfLines={1} ellipsizeMode="tail">
            파일 #{i+1}: {
              uploadedFiles[i] ? uploadedFiles[i].bf_source : (
                uploadFiles[`file${i+1}`] ? uploadFiles[`file${i+1}`].name : '파일 선택'
              )
            }
          </Text>
        </TouchableOpacity>
      );
    }
    return uploadFileInputs
  }

  return (
    <View style={[styles.container, bgThemedColor]}>
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
              style={[styles.input, styles.innerInput, textThemedColor]}
              placeholder="이름"
              placeholderTextColor={Colors.text_placeholder_black}
              value={formValue.wr_name}
              onChangeText={text => setFormValue({ ...formValue, wr_name: text })}
            />
            <TextInput
              style={[styles.input, styles.innerInput, textThemedColor]}
              placeholder="비밀번호"
              placeholderTextColor={Colors.text_placeholder_black}
              secureTextEntry={true}
              value={formValue.wr_password}
              onChangeText={text => setFormValue({ ...formValue, wr_password: text })}
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.innerInput, textThemedColor]}
            placeholder="이메일"
            placeholderTextColor={Colors.text_placeholder_black}
            value={formValue.wr_email}
            onChangeText={text => setFormValue({ ...formValue, wr_email: text })}
          />
          <TextInput
            style={[styles.input, styles.innerInput, textThemedColor]}
            placeholder="홈페이지"
            placeholderTextColor={Colors.text_placeholder_black}
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
                tintColors={{ false: Colors.checkbox_border }}
                accessibilityLabel={formValue.notice ? "Notice checkbox checked" : "Notice checkbox not checked"}
              />
              <Text style={[styles.checkboxText, textThemedColor]}>공지글</Text>
            </View>
          )}
          <View style={styles.checkboxInnerContainer}>
            <CheckBox
              name="secret"
              value={formValue.secret}
              
              onValueChange={() => setFormValue({ ...formValue, secret: !formValue.secret })}
              tintColors={{ false: Colors.checkbox_border }}
              accessibilityLabel={formValue.secret ? "Secret checkbox checked" : "Secret checkbox not checked"}
            />
            <Text style={[styles.checkboxText, textThemedColor]}>비밀글</Text>
          </View>
        </View>
        <TextInput
          style={[styles.input, textThemedColor]}
          placeholder="제목"
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.wr_subject}
          onChangeText={text => setFormValue({ ...formValue, wr_subject: text })}
        />
        <CKEditorForm
          webViewRef={webViewRef}
          handleMessage={handleMessage}
          navigation={navigation}
          bo_table={bo_table}
          write={route.params.write}
        />
        <TextInput
          style={[styles.input, textThemedColor]}
          placeholder="링크 #1"
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.wr_link1}
          onChangeText={text => setFormValue({ ...formValue, wr_link1: text })}
        />
        <TextInput
          style={[styles.input, textThemedColor]}
          placeholder="링크 #2"
          placeholderTextColor={Colors.text_placeholder_black}
          value={formValue.wr_link2}
          onChangeText={text => setFormValue({ ...formValue, wr_link2: text })}
        />

        {/* 첨부파일 인풋 렌더 */}
        {renderUploadFileInputs()}

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
            onPress={getContent}
          >
            <Text style={styles.buttnText}>작성완료</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const CKEditorForm = ({ webViewRef, handleMessage }) => {
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
  fileButton: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  fileButtonText: {
    color: Colors.text_black,
  },
  checkboxText: {
    color: Colors.text_black,
  }
});

export default WriteUpdateScreen;