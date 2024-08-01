import React, { useRef } from 'react';
import { Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';

const WriteUpdateScreen = ({ navigation, route }) => {
  console.log(route);
  return (
    <>
    <HeaderBackwardArrow navigation={navigation} />
    <CKEditorForm />
    </>
  );
}

const CKEditorForm = () => {
  const webViewRef = useRef(null);

  const getContent = () => {
    webViewRef.current.injectJavaScript('window.ReactNativeWebView.postMessage(getEditorContent());');
  };

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent("${content}");`);
  };

  const handleMessage = (event) => {
    console.log('Content from CKEditor:', event.nativeEvent.data);
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
      <Button title="Set Content" onPress={() => setContent('Hello from React Native!')} />
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