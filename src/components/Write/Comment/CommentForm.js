import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Switch,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../../../styles/colors';
import { useAuth } from '../../../context/auth/AuthContext';
import { useWriteRefresh } from '../../../context/writes/RefreshContext';
import { useTheme } from '../../../context/theme/ThemeContext';
import { 
  createCommentRequest, updateCommentRequest, createGuestCommentRequest
} from '../../../services/api/ServerApi';
import { Styles } from '../../../styles/styles';

export function CommentForm({ bo_table, wr_id, comment, setIsEditFormVisible, isUpdateComment }) {
  const { isLoggedIn } = useAuth();
  const { writeRefresh, setWriteRefresh } = useWriteRefresh();
  const [ error, setError ] = useState('');
  const [ commentFormValue, setCommentFormValue ] = useState({
    wr_content: isUpdateComment ? comment.save_content : '',
    wr_name: '',
    wr_password: '',
    wr_secret_checked: false,
    comment_id: comment?.wr_id ? comment.wr_id : 0,
  });
  const [ isLoading, setIsLoading ] = useState(false);
  const { textThemedColor } = useTheme();
  const commentFormKind = comment ? "대댓글" : "댓글";

  async function submitComment() {
    const dataToSend = {
      ...commentFormValue,
      wr_option: commentFormValue.wr_secret_checked ? 'secret' : 'html1',
    }

    if (!isLoggedIn) {
      if (!dataToSend.wr_name) {
        setError('작성자 이름을 입력해주세요.');
        return;
      }
      if(!dataToSend.wr_password) {
        setError('비밀번호를 입력해주세요.');
        return;
      }
    }

    if (!dataToSend.wr_content) {
      setError('댓글을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isUpdateComment) {
        response = await updateCommentRequest(bo_table, wr_id, comment.wr_id, dataToSend);
      } else {
        if (isLoggedIn) {
          response = await createCommentRequest(bo_table, wr_id, dataToSend);
        } else {
          response = await createGuestCommentRequest(bo_table, wr_id, dataToSend);
        }
      }
      setCommentFormValue({
        wr_content: '',
        wr_name: '',
        wr_password: '',
        wr_secret_checked: false,
        comment_id: comment?.wr_id ? comment.wr_id : 0,
      });
      setError('');
      setWriteRefresh(!writeRefresh);
      if (setIsEditFormVisible) {
        setIsEditFormVisible(false);
      }
      return response.data;
    } catch (error) {
      if (error.response.data.error.description)  {
        setError(error.response.data.error.description);
      } else {
        if (isUpdateComment) {
          setError('댓글 수정에 실패했습니다.');
        } else {
          setError('댓글 등록에 실패했습니다.');
        }
      }
      console.error("submitComment - CommentForm", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <TextInput
        style={[styles.input, textThemedColor]}
        multiline
        numberOfLines={3}
        placeholder={`${commentFormKind}내용을 입력해주세요`}
        placeholderTextColor={Colors.text_placeholder_black}
        value={commentFormValue.wr_content}
        onChangeText={(text) => setCommentFormValue({
          ...commentFormValue,
          wr_content: text,
        })}
      />
      <View style={styles.formFooter}>
        {!isLoggedIn && (
          <View style={styles.nonLoginInputs}>
            <TextInput
              style={[styles.halfInput, textThemedColor]}
              placeholder={`${commentFormKind} 작성자 이름`}
              placeholderTextColor={Colors.text_placeholder_black}
              value={commentFormValue.wr_name}
              onChangeText={(text) => setCommentFormValue({
                ...commentFormValue,
                wr_name: text
              })}
            />
            <TextInput
              style={[styles.halfInput, textThemedColor]}
              placeholder={`${commentFormKind} 비밀번호`}
              placeholderTextColor={Colors.text_placeholder_black}
              secureTextEntry
              value={commentFormValue.wr_password}
              onChangeText={(text) => setCommentFormValue({
                ...commentFormValue,
                wr_password: text
              })}
            />
          </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.formActions}>
          <View style={styles.secretCommentContainer}>
            <Switch
              trackColor={{ false: Colors.btn_gray }}
              thumbColor={Colors.white}
              value={commentFormValue.wr_secret_checked}
              onValueChange={(value) => setCommentFormValue({
                ...commentFormValue,
                wr_secret_checked: value
              })}
              style={styles.secretCommentSwitch}
            />
            <Text style={[styles.secretCommentText, textThemedColor]}>비밀 {commentFormKind}</Text>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitComment}
            disabled={isLoading}
          >
            {
              isLoading
              ? <ActivityIndicator color={Colors.white} />
              : (
                  <Text style={styles.submitButtonText}>
                    {isUpdateComment ? `${commentFormKind}수정`  : `${commentFormKind}등록`}
                  </Text>
                )
            }
            
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = new Styles.CommentForm();