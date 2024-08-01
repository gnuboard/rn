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
      const message = JSON.parse(event.nativeEvent.data);
      switch (message.type) {
        case 'ready':
          setContent(write.wr_content);
          break;
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
      <Button title="Get Content" onPress={getContent} />
      <Button title="Set Content" onPress={() => {setContent(write.wr_content);}} />
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