import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  Image, Alert, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommentForm } from './CommentForm';
import { Colors } from '../../../styles/colors';
import { deleteCommentRequest } from '../../../services/api/ServerApi';
import { useWriteRefresh } from '../../../context/writes/RefreshContext';
import { useTheme } from '../../../context/theme/ThemeContext';
import { getMemberIconUri } from '../../../utils/fileFunc';
import { CommentPasswordModal } from '../../Modals/Modal';
import { getReplyPrefix } from '../../../utils/writeFunc';
import { Styles } from '../../../styles/styles';

function Comment({
  comment,
  bo_table,
  wr_id,
  currentMbId,
  isHighlighted,
  isCommentPageChanged,
  setIsCommentPageChanged,
}) {
  const [ itemVisible, setItemVisible ] = useState(false);
  const [ isEditFormVisible, setIsEditFormVisible ] = useState(false);
  const [ isUpdateComment, setIsUpdateComment ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ isSecretCommentVisible, setIsSecretCommentVisible ] = useState(false);
  const [ secretCommentContent, setSecretCommentContent ] = useState(false);
  const { writeRefresh, setWriteRefresh } = useWriteRefresh();
  const { getThemedTextColor, textThemedColor, getThemedBackgroundColor } = useTheme();
  const highlightAnimation = useRef(new Animated.Value(0)).current;
  const highlightedBackgroundColor = highlightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [getThemedBackgroundColor(), Colors.highlight_gray],
  });

  useEffect(() => {
    if (isHighlighted) {
      Animated.sequence([
        Animated.timing(highlightAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(highlightAnimation, {
          toValue: 0,
          duration: 300,
          delay: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (isCommentPageChanged) {
      setIsEditFormVisible(false);
      setItemVisible(false);
      setIsCommentPageChanged(false);
    }
  }, [isCommentPageChanged]);

  async function deleteComment() {
    Alert.alert(
      '댓글 삭제',
      '정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            setItemVisible(false);
            deleteCommentRequest(bo_table, wr_id, comment.wr_id)
            .then(() => setWriteRefresh(!writeRefresh))
            .catch((error) => {
              Alert.alert(
                '댓글 삭제 실패',
                error.response.data.error.description,
                [{ text: '확인' }],
                { cancelable: false },
              )
              console.error('댓글 삭제 실패', error);
            });
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: highlightedBackgroundColor,
          marginLeft: comment.wr_comment_reply.length * 10
        }
      ]}
    >
      <View style={styles.divider} />
      <View style={styles.commentHeader}>
        <Text style={textThemedColor}>
          {getReplyPrefix(comment.wr_comment_reply)}
        </Text>
        <Image
          style={styles.avatar}
          source={{ uri: getMemberIconUri(comment) }}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentInfo}>
            <Text style={[styles.authorName, textThemedColor]}>{comment.wr_name}</Text>
            <Text style={[styles.dateTime, textThemedColor]}>{comment.wr_datetime}</Text>
          </View>
          <View style={styles.commentBody}>
            {comment.is_secret ? (
              <>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <View
                    style={[
                      styles.secretComment,
                      {display: isSecretCommentVisible ? "none" : "flex"}
                    ]}
                  >
                    <Icon name="lock-closed" size={16} color={getThemedTextColor()} />
                    <Text style={[styles.commentText, textThemedColor]}>{comment.save_content}</Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={[
                    styles.secretComment,
                    {display: isSecretCommentVisible ? "flex" : "none"}
                  ]}
                >
                  <Icon name="lock-closed" size={16} color={getThemedTextColor()} />
                  <Text style={[styles.commentText, textThemedColor]}>{secretCommentContent}</Text>
                </View>
              </>
            ) : (
              <Text style={[styles.commentText, textThemedColor]}>{comment.save_content}</Text>
            )}
          </View>
        </View>
        {itemVisible && (
          <View>
            <TouchableOpacity
              style={[styles.button, styles.replyButton]}
              onPress={() => {
                setIsUpdateComment(false);
                setIsEditFormVisible(!isEditFormVisible);
              }}
              accessible={true}
              accessibilityLabel={`댓글 아이디 ${comment.wr_id}에 답변하기`}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>답변</Text>
            </TouchableOpacity>
            {currentMbId == comment.mb_id ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={() => {
                    setIsUpdateComment(true);
                    setIsEditFormVisible(!isEditFormVisible);
                  }}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={deleteComment}
                >
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </>
            ): null}
          </View>
        )}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setItemVisible(!itemVisible)}
          accessible={true}
          accessibilityLabel={`댓글 아이디 ${comment.wr_id} 메뉴 열기`}
          accessibilityRole="button"
        >
          <Icon name="ellipsis-vertical" size={20} color={getThemedTextColor()} />
        </TouchableOpacity>
      </View>
      {isEditFormVisible &&(
        <CommentForm
          bo_table={bo_table}
          wr_id={wr_id}
          comment={comment}
          setIsEditFormVisible={setIsEditFormVisible}
          isUpdateComment={isUpdateComment}
        />
      )}
      <CommentPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setIsSecretCommentVisible={setIsSecretCommentVisible}
        setSecretCommentContent={setSecretCommentContent}
        bo_table={bo_table}
        wr_id={wr_id}
        comment_id={comment.wr_id}
      />
    </Animated.View>
  );
}

const styles = new Styles.Comment();

export default Comment;