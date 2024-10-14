import { Alert } from "react-native";
import { useAuth } from "../context/auth/AuthContext";
import { useBoards } from "../context/boards/BoardsContext";
import { readWrite } from "./writeFunc";

export const useHandleWrite = () => {
  const { getCurrentUserData } = useAuth();
  const { boardsConfig } = useBoards();

  const handleReadWrite = async (
    bo_table, write, setModalVisible, setModalWrId, navigation, isSearched
  ) => {
    const userData = await getCurrentUserData();
    const { bo_read_level } = boardsConfig[bo_table];
    const hasReadAllowed = (bo_read_level == 1) || (userData && userData.mb_level >= bo_read_level);

    if (hasReadAllowed) {
      readWrite(bo_table, write, setModalVisible, setModalWrId, navigation, isSearched);
    } else {
      Alert.alert('권한 없음', '해당 게시판의 글을 읽을 권한이 없습니다.');
    }
  }

  const handleReply = async (bo_table, write, navigation) => {
    const userData = await getCurrentUserData();
    const { bo_reply_level } = boardsConfig[bo_table];
    if ((bo_reply_level != 1) && (!userData || userData.mb_level < bo_reply_level)) {
      Alert.alert('권한 없음', '답변을 작성할 권한이 없습니다.');
    } else {
      navigation.navigate(
        'WriteUpdate',
        params={
          bo_table,
          'wr_parent': write.wr_id,
          'reply_subject': `Re: ${write.wr_subject}`,
        }
      )
    }
  }

  return { handleReply, handleReadWrite };
}