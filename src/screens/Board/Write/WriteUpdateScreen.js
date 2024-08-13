import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import { fetchBoardConfigRequest, createWriteRequest, updateWriteRequest } from '../../../services/api/ServerApi';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import { useAuth } from '../../../context/auth/AuthContext';

const WriteUpdateScreen = ({ navigation, route }) => {
  return (
    <>
      <HeaderBackwardArrow navigation={navigation} />
      <CKEditorForm navigation={navigation} bo_table={route.params.bo_table} write={route.params.write} />
    </>
  );
}

const CKEditorForm = ({ navigation, bo_table, write }) => {
  const webViewRef = useRef(null);
  const { writeRefresh, setWriteRefresh } = useWriteRefresh();
  const { setWriteListRefresh } = useWriteListRefresh();
  const { isLoggedIn } = useAuth();
  const category = { bo_use_category: 0, bo_category_list: '' }

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
  };

  const setWriteFormData = (write) => {
    webViewRef.current.injectJavaScript(`setWriteFormData(${JSON.stringify(write)});`);
  }

  const setbyLoginStatus = (isLoggedIn) => {
    webViewRef.current.injectJavaScript(`setByLoginStatus(${isLoggedIn});`);
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
          setbyLoginStatus(isLoggedIn);
          fetchBoardConfigRequest(bo_table)
            .then(response => {
              category.bo_use_category = response.data.bo_use_category;
              category.bo_category_list = response.data.bo_category_list;
            })
            .then(() => {
              webViewRef.current.injectJavaScript(`setCategoryList(${JSON.stringify(category)});`);
            })
            .catch(error => console.error('fetchBoardConfigReques - CKEditorForm', error));

            if (!write) {
            break;
          }

          setContent(write.wr_content);
          setWriteFormData(write);
          break;
        case 'submit':
          if (!isLoggedIn) {
            if (!message.data.wr_name) {
              alert('비회원 글쓰기시 이름을 기재해야 합니다.');
              return;
            } else if (!message.data.wr_password) {
              alert('비회원 글쓰기시 비밀번호를 기재해야 합니다.');
              return;
            }
          }
          if (!message.data.wr_subject) {
            alert('제목을 입력해주세요.');
            return;
          } else if (!message.data.wr_content) {
            alert('내용을 입력해주세요.');
            return;
          }
          if (!write) {
            // 새게시글 작성
            try {
              const response = await createWriteRequest(bo_table, message.data);
              if (response.status === 200) {
                const wr_id = response.data.wr_id;
                setWriteListRefresh(true);
                navigation.navigate('Write', { bo_table, wr_id });
              }
            } catch (error) {
              console.error('Error creating new write:', error.response);
            }
          } else {
            // 게시글 수정
            try {
              const response = await updateWriteRequest(bo_table, write.wr_id, message.data);
              if (response.status === 200) {
                setWriteListRefresh(true);
                setWriteRefresh(!writeRefresh);
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
  webViewContainer: {
    marginTop: '15%',
    height: '85%',
  },
});

export default WriteUpdateScreen;