import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
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

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
  };

  const setWriteFormData = (write) => {
    webViewRef.current.injectJavaScript(`setWriteFormData(${JSON.stringify(write)});`);
  }

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
          setWriteFormData(write);
          break;
        case 'submit':
          console.log('Received content from CKEditor:', message.type, message.data.slice(0, 5));
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