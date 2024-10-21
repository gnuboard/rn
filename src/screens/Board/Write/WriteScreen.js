import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Linking,
  useWindowDimensions, TouchableOpacity, Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import { fetchBoardConfigRequest } from '../../../services/api/ServerApi';
import { Colors } from '../../../constants/theme';
import { useWriteRefresh, useWriteListRefresh } from '../../../context/writes/RefreshContext';
import Comment from '../../../components/Write/Comment/Comment';
import { CommentForm } from '../../../components/Write/Comment/CommentForm';
import {
  fetchWriteRequest, fetchCommentsRequest,
  deleteWriteRequest, checkDownloadFileAccessRequest
} from '../../../services/api/ServerApi';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTheme } from '../../../context/theme/ThemeContext';
import { useHandleWrite } from '../../../utils/hooks';
import { getMemberIconUri } from '../../../utils/fileFunc';
import { getTokens } from '../../../utils/authFunc';
import { adaptHttps } from '../../../utils/stringFunc';
import { Pagination } from '../../../components/Pagination/Pagination';

const WriteScreen = ({ navigation, route }) => {
  const {
    bo_table,
    wr_id,
    isVerified,
    writeData,
    comment_id,
    commentPage,
  } = route.params;
  const [ write, setWrite ] = useState(null);
  const [ comments, setComments ] = useState([]);
  const [ commentsPage, setCommentsPage ] = useState({ currentPage: 1, totalPages: 1});
  const [ isCommentPageChanged, setIsCommentPageChanged ] = useState(false);
  const { writeRefresh } = useWriteRefresh();
  const { refreshWriteList } = useWriteListRefresh();
  const { width } = useWindowDimensions();
  const { getCurrentUserData } = useAuth();
  const [ currentMbId, setCurrentMbId ] = useState(null);
  const [ itemVisible, setItemVisible ] = useState(false);
  const { bgThemedColor, getThemedTextColor, textThemedColor } = useTheme();
  const scrollViewRef = useRef(null);
  const commentRefs = useRef({});
  const [ alarmCommentId, setAlarmCommentId ] = useState(comment_id);
  const [ highlightedCommentId, setHighlightedCommentId ] = useState(null);
  const { handleReply } = useHandleWrite();

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
      fetchCommentAndUserData();
    } else {
      fetchWriteTotally();
    }
  }, [bo_table, wr_id, writeData, writeRefresh]);

  useEffect(() => {
    scrollToComment();
  }, []);

  async function fetchCommentAndUserData() {
    try {
      const [ fetchCommentResponse, currentUserData ] = await Promise.all([
        fetchCommentsRequest(bo_table, writeData.wr_id, commentPage),
        getCurrentUserData(),
      ]);

      // 댓글
      setComments(fetchCommentResponse.data.comments);
      setCommentsPage({
        currentPage: fetchCommentResponse.data.current_page,
        totalPages: fetchCommentResponse.data.total_pages,
      });

      // 현재 사용자 정보
      setCurrentMbId(currentUserData.mb_id);
    } catch (error) {
      console.error("fetchCommentAndUserData", error);
    }
  }

  async function fetchWriteTotally() {
    try {
      const [ fetchWriteResponse, fetchCommentResponse, currentUserData ] = await Promise.all([
        fetchWriteRequest(bo_table, wr_id),
        fetchCommentsRequest(bo_table, wr_id, commentPage),
        getCurrentUserData(),
      ]);

      // 게시글
      setWrite(fetchWriteResponse.data);

      // 댓글
      setComments(fetchCommentResponse.data.comments);
      setCommentsPage({
        currentPage: fetchCommentResponse.data.current_page,
        totalPages: fetchCommentResponse.data.total_pages,
      })

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

  const onCommentPageChange = (page) => {
    fetchCommentsRequest(bo_table, wr_id, page)
    .then(response => {
      setComments(response.data.comments);
      setCommentsPage({
        currentPage: response.data.current_page,
        totalPages: response.data.total_pages,
      });
      setIsCommentPageChanged(true);
    })
    .catch(error => console.error("onCommentPageChange", error));
  }

  const scrollToComment = useCallback(() => {
    const promises = comments.map(comment =>
      new Promise(resolve => {
        if (commentRefs.current[comment.wr_id]) {
          commentRefs.current[comment.wr_id].measureLayout(
            scrollViewRef.current,
            (x, y) => {
              resolve({ id: comment.wr_id, y });
            },
            () => resolve(null)
          );
        } else {
          resolve(null);
        }
      })
    );

    Promise.all(promises).then(() => {
      if (commentRefs.current[alarmCommentId]) {
        commentRefs.current[alarmCommentId].measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y, animated: true });
          },
          () => console.log('Failed to measure comment layout')
        );

        // Highlight comment after scrolling
        setHighlightedCommentId(`comment_${alarmCommentId}`);
        setTimeout(() => {
          setHighlightedCommentId(null);
          setAlarmCommentId(null);
        }, 2000);
      }
    });
  }, []);

  if (!write) {
    return (
      <View style={[styles.container, bgThemedColor]}>
        <Text style={[styles.loading_text, textThemedColor]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, bgThemedColor]}
      ref={scrollViewRef}
      onLayout={scrollToComment}
    >
      <View style={styles.subjectWithButton}>
        <Text style={[styles.title, textThemedColor]}>{write?.wr_subject}</Text>
        {itemVisible && (
          <View style={styles.bindedButton}>
            <TouchableOpacity
              style={[styles.buttonCommon, styles.replyButton]}
              onPress={() => handleReply(bo_table, write, navigation)}
            >
              <Text style={styles.buttonText}>답변</Text>
            </TouchableOpacity>
            {currentMbId == write.mb_id ? (
              <>
                <TouchableOpacity
                  style={[styles.buttonCommon, styles.updateButton]}
                  onPress={() => navigation.navigate(
                    'WriteUpdate', params={'bo_table': bo_table, 'write': write}
                  )}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonCommon, styles.deleteButton]}
                  onPress={() => showDeleteConfirm(
                    bo_table, write, navigation, refreshWriteList
                  )}>
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </>
            ): null}
          </View>
        )}
        <TouchableOpacity onPress={() => setItemVisible(!itemVisible)}>
          <Icon name="ellipsis-vertical" size={20} color={getThemedTextColor()} />
        </TouchableOpacity>
      </View>
      <View style={styles.metaContainer}>
        <View style={styles.authorAvatar}>
          <Image 
            source={{ uri: getMemberIconUri(write) }}
            style={styles.avatarImage} 
          />
        </View>
        <View style={styles.metaInfo}>
        <Text style={[styles.author, textThemedColor]}>{write?.wr_name}</Text>
          <Text style={[styles.date, textThemedColor]}>{write?.wr_datetime}</Text>
        </View>
      </View>
      <WriteContentWeVview width={width} write={write} />
      {
        write.normal_files.map((file, index) => (
          <TouchableOpacity
            style={styles.fileContainer}
            key={index} onPress={() => downloadFile(file)}
          >
            <Icon name="download" style={styles.wrFile} />
            <View>
              <View style={styles.fileSubject}>
                <Text style={[styles.fileName, textThemedColor]}>{file.bf_source}</Text>
                <Text style={[styles.fileSize, textThemedColor]}> ({file.bf_filesize}byte)</Text>
              </View>
              <Text style={[styles.fileDownload, textThemedColor]}>
                {file.bf_download}회 다운로드 | Date: {file.bf_datetime}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      }
      {
        write.wr_link1 && (
          <View style={styles.linkContainer}>
            <Icon name="link" style={styles.wrLink} />
            <Text
              style={[styles.linkText, textThemedColor]}
              onPress={() => {Linking.openURL(`${adaptHttps(write.wr_link1)}`)}}
            >
              {adaptHttps(write.wr_link1)}
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
              onPress={() => {Linking.openURL(`${adaptHttps(write.wr_link2)}`)}}
            >
              {adaptHttps(write.wr_link2)}
            </Text>
          </View>
        )
      }
      <View style={styles.commentContainer}>
        <Text style={[styles.commentHeaderText, textThemedColor]}>댓글</Text>
        {comments.length > 0
        ? comments.map((comment, index) => (
            <View
              key={index}
              ref={ref => commentRefs.current[comment.wr_id] = ref}
            >
              <Comment
                comment={comment}
                bo_table={bo_table}
                wr_id={wr_id}
                currentMbId={currentMbId}
                isHighlighted={highlightedCommentId === `comment_${comment.wr_id}`}
                isCommentPageChanged={isCommentPageChanged}
                setIsCommentPageChanged={setIsCommentPageChanged}
              />
            </View>
          ))
        : <Text style={[styles.noCommentText, textThemedColor]}>등록된 댓글이 없습니다.</Text>}
        <View style={styles.commentsPAgeContainer}>
          <Pagination
            totalPages={commentsPage.totalPages}
            currentPage={commentsPage.currentPage}
            onPageChange={(page) => onCommentPageChange(page)}
          />
        </View>
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
        ${write?.images.map(image =>
          `<img src="${image.bf_file}" style="max-width: ${width}px; height: auto;" />`
        )}
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
    alert(error.response.data.error.description);
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
  const { fs } = RNFetchBlob;
  const downloadPath = `${fs.dirs.DownloadDir}/${fileName}`;
  const tokenInfo = await getTokens();
  const authorization = (tokenInfo && tokenInfo.access_token) ? `Bearer ${tokenInfo.access_token}` : ''

  try {
    const response = await checkDownloadFileAccessRequest(url);
    if (response.status !== 200) {
      Alert.alert('파일 다운로드 실패', '파일 다운로드 과정에서 문제가 발생했습니다.');
      return;
    }
  } catch (error) {
    if (error.response.status === 403) {
      Alert.alert('권한 없음', '파일 다운로드 권한이 없습니다.');
      return;
    }
  }

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
    .fetch('GET', url, {Authorization: authorization})
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
    padding: 16,
  },
  subjectWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '98%',
  },
  buttonCommon: {
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 10,
    marginRight: 10,
    width: 55,
  },
  replyButton: {
    paddingVertical: 3,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_green,
    borderRadius: 4,
    marginBottom: 10,
    marginRight: 10,
    width: 55,
  },
  updateButton: {
    paddingVertical: 3,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_blue,
    borderRadius: 4,
    marginBottom: 10,
    marginRight: 10,
    width: 55,
  },
  buttonText: {
    color: Colors.btn_text_white,
  },
  deleteButton: {
    paddingVertical: 3,
    paddingHorizontal: 16,
    backgroundColor: Colors.btn_gray,
    borderRadius: 4,
    marginBottom: 10,
    width: 55,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    width: '80%',
  },
  bindedButton: {
    position: 'absolute',
    top: 10,
    right: 15,
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
    textAlign: 'center',
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
    color: Colors.text_black,
  },
  fileSubject: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  fileName: {
    fontWeight: 'bold',
    color: Colors.text_black,
  },
  fileSize: {
    color: Colors.text_black,
  },
  fileDownload:{
    color: Colors.text_black,
  },
  loading_text: {
    fontSize: 24,
  },
  commentsPAgeContainer: {
    alignItems: 'center',
  },
});

export default WriteScreen;