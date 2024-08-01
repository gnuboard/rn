import React, { useRef } from 'react';
import { Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';

const WriteUpdateScreen = ({ navigation, route }) => {
  return (
    <>
    <HeaderBackwardArrow navigation={navigation} />
    <CKEditorForm write={route.params.write} />
    </>
  );
}

const CKEditorForm = ({ write }) => {
  const webViewRef = useRef(null);

  const getContent = () => {
    webViewRef.current.injectJavaScript('window.ReactNativeWebView.postMessage(getEditorContent());');
  };

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
  };

  const handleMessage = (event) => {
    try {
      const eventData = event.nativeEvent.data;
      if (eventData === 'undefined') {
        return;
      }

      const message = JSON.parse(eventData);
      switch (message.type) {
        case 'ready':
          setContent(write.wr_content);
          break;
        case 'submit':
          console.log('Received content from CKEditor:', message.type, message.data.slice(0, 5));
          break
        default:
          console.log('Received message from CKEditor:', message);
      }
    } catch (error) {
      console.error('Error parsing event data:', error);
    }
  };

  return (
    <>
      <WebView
        ref={webViewRef}
        source={{ uri: 'file:///android_asset/editor_form/ckeditor_form.html' }}
        onMessage={handleMessage}
        style={styles.webViewContainer}
      />
      <Button title="수정하기" onPress={getContent} />
    </>
  );
}

const styles = StyleSheet.create({
  webViewContainer: {
    marginTop: '15%',
    height: '85%',
  },
});

export default WriteUpdateScreen;