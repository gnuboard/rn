import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Switch
} from 'react-native';
import { Colors } from '../../../constants/theme';

export function CommentForm({ bo_table, wr_id }) {
  const [commentFormValue, setCommentFormValue] = useState({
    wr_content: '',
    wr_name: '',
    wr_password: '',
    wr_secret_checked: false,
    comment_id: 0,
  });

  async function submitComment() {
    console.log("댓글등록 함수 필요");
  }

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={3}
        placeholder="댓글내용을 입력해주세요"
        value={commentFormValue.wr_content}
        onChangeText={(text) => setCommentFormValue({
          ...commentFormValue,
          wr_content: text,
        })}
      />
      <View style={styles.formFooter}>
        <View style={styles.nonLoginInputs}>
          <TextInput
            style={styles.smallInput}
            placeholder="작성자 이름"
            value={commentFormValue.wr_name}
            onChangeText={(text) => setCommentFormValue({
              ...commentFormValue,
              wr_name: text
            })}
          />
          <TextInput
            style={styles.smallInput}
            placeholder="비밀번호"
            secureTextEntry
            value={commentFormValue.wr_password}
            onChangeText={(text) => setCommentFormValue({
              ...commentFormValue,
              wr_password: text
            })}
          />
        </View>
        <View style={styles.formActions}>
          <View style={styles.secretCommentContainer}>
            <Switch
              value={commentFormValue.wr_secret_checked}
              onValueChange={(value) => setCommentFormValue({
                ...commentFormValue,
                wr_secret_checked: value
              })}
            />
            <Text style={styles.secretCommentText}>비밀댓글</Text>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => submitComment(bo_table, wr_id, commentFormValue)}
          >
            <Text style={styles.submitButtonText}>댓글등록</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  formFooter: {
    marginTop: 10,
  },
  nonLoginInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    width: '48%',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secretCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secretCommentText: {
    marginLeft: 8,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: Colors.btn_blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
  },
});