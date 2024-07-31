import React, { useRef, useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderBackwardArrow } from '../../../components/Common/Arrow';

const WriteUpdateScreen = ({ navigation, route }) => {
  console.log(route);
  return (
    <>
    <HeaderBackwardArrow navigation={navigation} />
    <CKEditorWebView />
    </>
  );
}

const CKEditorWebView = ({ initialContent = '' }) => {
  const webViewRef = useRef(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.ckeditor.com/4.22.0/standard/ckeditor.js"></script>
        <style>
            /* Hide the error message */
            .cke_notification_warning {
                display: none !important;
            }
        </style>
    </head>
    <body>
        <textarea name="editor" id="editor"></textarea>
        <script>
            CKEDITOR.replace('editor', {
                removePlugins: 'easyimage,cloudservices',
                cloudServices_tokenUrl: '',
                cloudServices_uploadUrl: ''
            });
            CKEDITOR.instances.editor.on('instanceReady', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
            });
            CKEDITOR.instances.editor.on('change', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'content',
                    data: CKEDITOR.instances.editor.getData()
                }));
            });
            // Additional step to remove the notification
            CKEDITOR.on('instanceReady', function(ev) {
                ev.editor.removeListener('dialogHide', CKEDITOR.config.cbdBrokenPackageDialogHack);
            });
        </script>
    </body>
    </html>
  `;

  const onMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === 'ready') {
      setEditorReady(true);
    } else if (message.type === 'content') {
      setEditorContent(message.data);
    }
  };

  const injectJavaScript = (content) => {
    const js = `
      CKEDITOR.instances.editor.setData(${JSON.stringify(content)});
      true;
    `;
    webViewRef.current.injectJavaScript(js);
  };

  useEffect(() => {
    if (editorReady && initialContent) {
      injectJavaScript(initialContent);
    }
  }, [editorReady, initialContent]);

  return (
    <View style={styles.webViewContainer}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={onMessage}
        javaScriptEnabled={true}
      />
      <Button
        title="Get Content"
        onPress={() => console.log(editorContent)}
      />
      <Button
        title="Set Content"
        onPress={() => injectJavaScript('<p>New content set from React Native</p>')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webViewContainer: {
    marginTop: '15%',
    height: '85%',
  },
});

export default WriteUpdateScreen;