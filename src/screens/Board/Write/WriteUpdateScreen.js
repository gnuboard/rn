import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';
import { fetchBoardConfigRequest, updateWriteRequest } from '../../../services/api/ServerApi';
import { useRefresh } from '../../../auth/context/RefreshContext';

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
  const { refreshing, setRefreshing } = useRefresh();
  const category = { bo_use_category: 0, bo_category_list: '' }

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
  };

  const setWriteFormData = (write) => {
    webViewRef.current.injectJavaScript(`setWriteFormData(${JSON.stringify(write)});`);
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
          try {
            const response = await updateWriteRequest(bo_table, write.wr_id, message.data);
            if (response.status === 200) {
              setRefreshing(!refreshing);
              navigation.goBack();
            }
          } catch (error) {
            console.error('Error updating write:', error);
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