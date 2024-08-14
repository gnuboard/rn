import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import { WritePasswordModal } from "../Modals/Modal";
import { readWrite } from "../../utils/writeFunc";
import { Colors } from "../../constants/theme";

const WriteListItem = ({ bo_table, write }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWrId, setModalWrId] = useState(null);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.writeContainer}
      onPress={() => readWrite(bo_table, write, setModalVisible, setModalWrId, navigation)}
    >
      <View style={styles.writeMainContainer}>
        {write.wr_option.includes('secret') && <Icon name="lock-closed" size={15} color="#000" style={styles.wrMainArg} />}
        <Text style={styles.wrMainArg}>{write.wr_subject}</Text>
        {write.wr_comment > 0 && <Text style={[styles.wrMainArg, styles.wrCommentText]}> {write.wr_comment}</Text>}
        {write.wr_link1 && <Icon name="link" style={[styles.wrMainArg, styles.wrLink]} />}
        {(write.normal_files.length > 0 || write.images.length > 0) && <Icon name="download" style={[styles.wrMainArg, styles.wrFile]} />}
      </View>
      <View style={styles.writeSubContainer}>
        <Text style={styles.wrSubArg}>{write.wr_name}</Text>
        <Text style={styles.wrSubArg}>조회수 {write.wr_hit}</Text>
        <Text style={styles.wrSubArg}>추천 {write.good}</Text>
        <Text style={styles.wrSubArg}>비추 {write.nogood}</Text>
        <Text style={styles.wrSubArg}>
          {(() => {
            const date = new Date(write.wr_datetime);
            return date.toISOString().slice(2, 10).replace(/-/g, '-');
          })()}
        </Text>
      </View>
      <WritePasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        bo_table={bo_table}
        wr_id={write.wr_id}
        modalWrId={modalWrId}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  writeContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  writeMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  wrMainArg: {
    marginRight: 5,
  },
  writeSubContainer: {
    flexDirection: 'row',
  },
  wrSubArg: {
    marginRight: 10,
    fontSize: 11,
  },
  wrCommentText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.comment_count_bg,
    width: 16,
    height: 16,
    fontSize: 11,
  },
  wrLink: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.link_icon_bg,
    width: 16,
    height: 16,
    fontSize: 11,
  },
  wrFile: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.file_icon_bg,
    width: 16,
    height: 16,
    fontSize: 11,
  },
});

export default WriteListItem;