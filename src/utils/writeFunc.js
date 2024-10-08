import { Alert } from "react-native";
import { apiConfig } from "../services/api/config/ServerApiConfig";

export function readWrite(
  bo_table, write, setModalVisible, setModalWrId, navigation, isSearched
) {
  if (isSearched) {
    if (write.type === 'comment') {
      const order = write.comment_order;
      const commentPage = Math.ceil(order / apiConfig.commentsPerPage);
      if (write.wr_parent_option.includes('secret')) {
        setModalWrId(write.wr_parent);
        setModalVisible(true);
        return;
      } else {
        navigation.navigate(
          'Boards',
          {
            screen: 'Write',
            params: {
              bo_table,
              wr_id: write.wr_parent,
              comment_id: write.wr_id,
              commentPage,
            },
            initial: false,
          },
        )
        return;
      }
    }
  }

  if (write.wr_option.includes('secret')) {
    setModalWrId(write.wr_id);
    setModalVisible(true);
  } else {
    navigation.navigate(
      'Boards',
      {
        screen: 'Write',
        params: {bo_table, 'wr_id': write.wr_id},
        initial: false,
      },
    );
  }
}

export const handleReadWrite = async (
  getCurrentUserData,
  boardsConfig,
  bo_table,
  write,
  setModalVisible,
  setModalWrId,
  navigation,
  isSearched
) => {
  const userData = await getCurrentUserData();
  const { bo_read_level } = boardsConfig[bo_table];
  const hasReadAllowed = (bo_read_level == 1) || (userData && userData.mb_level >= bo_read_level);

  if (hasReadAllowed) {
    readWrite(bo_table, write, setModalVisible, setModalWrId, navigation, isSearched);
  } else {
    Alert.alert('글 읽기', '해당 게시판의 글을 읽을 권한이 없습니다.');
  }
}

export function getReplyPrefix(wr_reply) {
  if (!wr_reply) {
    return '';
  }

  let replyPrefix = '';
  replyPrefix = '   '.repeat(wr_reply.length);
  replyPrefix += '└ ';
  return replyPrefix;
}