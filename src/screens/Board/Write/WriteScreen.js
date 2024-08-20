import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Linking,
  useWindowDimensions, TouchableOpacity, Alert, Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import { fetchBoardConfigRequest } from '../../../services/api/ServerApi';
import Config from 'react-native-config';
import { Colors } from '../../../constants/theme';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import Comment from '../../../components/Write/Comment/Comment';
import { CommentForm } from '../../../components/Write/Comment/CommentForm';
import { fetchWriteRequest, fetchCommentsRequest, deleteWriteRequest } from '../../../services/api/ServerApi';
import { useAuth } from '../../../context/auth/AuthContext';
import { requestStoragePermission } from '../../../utils/os/android/permission';

const WriteScreen = ({ navigation, route }) => {
  const { bo_table, wr_id, isVerified, writeData } = route.params;
  const [ write, setWrite ] = useState(null);
  const [ comments, setComments ] = useState([]);
  const { writeRefresh } = useWriteRefresh();
  const { refreshWriteList } = useWriteListRefresh();
  const { width } = useWindowDimensions();
  const { getCurrentUserData } = useAuth();
  const [ currentMbId, setCurrentMbId ] = useState(null);

  useEffect(() => {
    if (isVerified) {
      setWrite(writeData);
      fetchBoardConfigRequest(bo_table)
      .then(response => {
        const noticeArray = response.data.bo_notice.split(',');
        const notice = noticeArray.includes(String(wr_id));
        setWrite(prevState => ({
          ...prevState,
          notice: notice,
        }))
      })
      .catch(error =>console.error("fetchBoardConfigRequest", error));
    } else {
      fetchWriteTotally();
    }
  }, [bo_table, wr_id, writeData, writeRefresh]);

  async function fetchWriteTotally() {
    try {
      const [ fetchWriteResponse, fetchCommentResponse, currentUserData ] = await Promise.all([
        fetchWriteRequest(bo_table, wr_id),
        fetchCommentsRequest(bo_table, wr_id),
        getCurrentUserData(),
      ]);

      // 게시글
      setWrite(fetchWriteResponse.data);

      // 댓글
      setComments(fetchCommentResponse.data.comments);

      // 현재 사용자 정보
      setCurrentMbId(currentUserData.mb_id);

      // 게시판 설정
      const fetchBoardConfigResponse = await fetchBoardConfigRequest(bo_table);
      const noticeArray = fetchBoardConfigResponse.data.bo_notice.split(',');
      const notice = noticeArray.includes(String(wr_id));
      setWrite(prevState => ({
        ...prevState,
        notice: notice,
      }));
    } catch (error) {
      if (!error.response) {
        console.error("fetchWriteTotally - !error.response", error);
        return;
      }
      if (error.response.status === 404) {
        refreshWriteList(bo_table);
        Alert.alert(
          "Notification",
          "게시물이 존재하지 않습니다.",
          [
            {
              text: "확인",
              onPress: () => {
                navigation.navigate(
                  'Boards',
                  {
                    screen: 'WriteList',
                    params: { bo_table: bo_table },
                    initial: false,
                  }
                );
              },
            },
          ],
          { cancelable: false }
        )
        return;
      }
    }
  }

  if (!write) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subjectWithButton}>
        <Text style={styles.title}>{write?.wr_subject}</Text>
        {currentMbId == write.mb_id ? (
          <View style={styles.bindedButton}>
            <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('WriteUpdate', params={'bo_table': bo_table, 'write': write})}>
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => showDeleteConfirm(
                bo_table, write, navigation, refreshWriteList
              )}>
              <Text style={styles.buttonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        ): null}
      </View>
      <View style={styles.metaContainer}>
        <View style={styles.authorAvatar}>
          <Image 
            source={{ uri: `${Config.SERVER_URL}${write?.mb_icon_path}` }} 
            style={styles.avatarImage} 
          />
        </View>
        <View style={styles.metaInfo}>
        <Text style={styles.author}>{write?.wr_name}</Text>
          <Text style={styles.date}>{write?.wr_datetime}</Text>
        </View>
      </View>
      <WriteContentWeVview width={width} write={write} />
      {
        write.normal_files.map((file, index) => (
          <TouchableOpacity style={styles.fileContainer} key={index} onPress={() => downloadFile(file)}>
            <Icon name="download" style={styles.wrFile} />
            <View>
              <View style={styles.fileSubject}>
                <Text style={styles.fileName}>{file.bf_source}</Text>
                <Text> ({file.bf_filesize}byte)</Text>
              </View>
              <Text>{file.bf_download}회 다운로드 | Date: {file.bf_datetime}</Text>
            </View>
          </TouchableOpacity>
        ))
      }
      {
        write.wr_link1 && (
          <View style={styles.linkContainer}>
            <Icon name="link" style={styles.wrLink} />
            <Text
              style={styles.linkText}
              onPress={() => {Linking.openURL(`${write.wr_link1}`)}}
            >
              {write.wr_link1}
            </Text>
          </View>
        )
      }
      {
        write.wr_link2 && (
          <View style={styles.linkContainer}>
            <Icon name="link" style={styles.wrLink} />
            <Text
              style={styles.linkText}
              onPress={() => {Linking.openURL(`${write.wr_link2}`)}}
            >
              {write.wr_link2}
            </Text>
          </View>
        )
      }
      <View style={styles.commentContainer}>
        <Text style={styles.commentHeaderText}>댓글</Text>
        {comments.length > 0
        ? comments.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              bo_table={bo_table}
              wr_id={wr_id}
              currentMbId={currentMbId}
            />
          ))
        : <Text style={styles.noCommentText}>등록된 댓글이 없습니다.</Text>}
        <CommentForm bo_table={bo_table} wr_id={wr_id} />
      </View>
    </ScrollView>
  );
};

const WriteContentWeVview = ({ width, write }) => {
  const [ webViewHeight, setWebViewHeight ] = useState(0);
  const webViewRef = useRef(null);

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        ${write?.wr_content}
        <script>
          window.ReactNativeWebView.postMessage(document.body.scrollHeight);
        </script>
      </body>
    </html>
  `;

  const onMessage = (event) => {
    const contentHeight = parseInt(event.nativeEvent.data, 10);
    setWebViewHeight(contentHeight);  // wr_content에 따른 WebView 높이 설정 -> window.ReactNativeWebView.postMessage(document.body.scrollHeight); 와 연동
  };

  return (
    <View style={{ width: width }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight);"
        onMessage={onMessage}
        style={{ height: webViewHeight }}
        javaScriptEnabled={true}
      />
    </View>
  );
};

async function deleteWrite(bo_table, write, navigation, refreshWriteList) {
  let wr_password;

  if (!write.mb_id) {
    // wr_password = prompt('비회원 게시글 삭제시 비밀번호가 필요합니다.'); // prompt is not supported in React Native
    if (!wr_password) {
      return;
    }
  }

  try {
    let response;
    if (write.mb_id) {
      response = await deleteWriteRequest(bo_table, write.wr_id);
    } else {
      // response = await deleteNoneMemberWriteRequest(bo_table, write.wr_id, wr_password); // deleteNoneMemberWriteRequest is not implemented
    }

    if (response.status === 200) {
      Alert.alert(
        "Notification",
        "게시물이 삭제되었습니다.",
        [
          {
            text: "확인",
            onPress: () => {
              refreshWriteList(bo_table);
              navigation.navigate(
                'Boards',
                {
                  screen: 'WriteList',
                  params: { bo_table: bo_table },
                  initial: false,
                }
              );
            },
          },
        ],
        { cancelable: false }
      );
    }
  } catch (error) {
    console.error(error);
    if (error.response.status === 403) {
      alert(error.response.data.detail);
    }
  }
}

const showDeleteConfirm = (bo_table, write, navigation, refreshWriteList) => {
  Alert.alert(
    "Confirmation",
    "정말 삭제하시겠습니까?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => deleteWrite(bo_table, write, navigation, refreshWriteList)
      }
    ],
    { cancelable: false }
  );
};

const downloadFile = async (file) => {
  const url = file.bf_file;
  const fileName = file.bf_source;

  if (Platform.OS === 'android') {
    const granted = await requestStoragePermission();
    if (!granted) {
      Alert.alert('권한이 거절되었습니다.', '파일 다운로드를 위해선 저장소 접근 권한이 필요합니다.');
      return;
    }
  }

  const { fs } = RNFetchBlob;
  const downloadPath = `${fs.dirs.DownloadDir}/${fileName}`;

  RNFetchBlob
    .config({
      fileCache: true,
      path: downloadPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: downloadPath,
        description: 'Downloading file...',
      },
    })
    .fetch('GET', url)
    .then((res) => {
      Alert.alert('파일 다운로드 완료', `저장장소: ${res.path()}`);
    })
    .catch((error) => {
      console.error('downloadFile Error', error);
      Alert.alert('파일 다운로드 실패', '파일 다운로드 과정에서 문제가 발생했습니다.');
    });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  subjectWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_blue,
    borderRadius: 4,
    marginBottom: 16,
    marginRight: 10,
  },
  buttonText: {
    color: Colors.btn_text_white,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_gray,
    borderRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bindedButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5e3aee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaInfo: {
    justifyContent: 'center',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  commentContainer: {
    marginTop: 50,
    paddingBottom: 100,
  },
  commentHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCommentText: {
    textAlign: 'center'
  },
  linkContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'gray',
    padding: 5,
    marginBottom: 10,
    height: 45,
    alignItems: 'center',
  },
  wrLink: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.link_icon_bg,
    width: 30,
    height: 30,
    fontSize: 17,
    marginRight: 10,
  },
  fileContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'gray',
    padding: 5,
    marginBottom: 10,
    height: 45,
    alignItems: 'center',
  },
  wrFile: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.file_icon_bg,
    width: 30,
    height: 30,
    fontSize: 17,
    marginRight: 10,
  },
  linkText: {
    fontWeight: 'bold',
  },
  fileSubject: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  fileName: {
    fontWeight: 'bold',
  },
});

export default WriteScreen;