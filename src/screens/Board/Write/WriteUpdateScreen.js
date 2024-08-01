import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    setTimeout(() => {
      setContent(write.wr_content);
    }, 1500);
  }, []);

  const getContent = () => {
    webViewRef.current.injectJavaScript('window.ReactNativeWebView.postMessage(getEditorContent());');
  };

  const setContent = (content) => {
    webViewRef.current.injectJavaScript(`setEditorContent(${JSON.stringify(content)});`);
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