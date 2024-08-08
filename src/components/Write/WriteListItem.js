import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';

const WriteListItem = ({ bo_table, item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.writeContainer}
      onPress={() => navigation.navigate('Write', {bo_table, 'wr_id': item.wr_id})}
    >
      <View style={styles.writeMainContainer}>
        {item.wr_option.includes('secret') && <Icon name="lock-closed" size={15} color="#000" style={styles.wrMainArg} />}
        <Text style={styles.wrMainArg}>{item.wr_subject}</Text>
        {item.wr_comment > 0 && <Text style={[styles.wrMainArg, styles.wrCommentText]}> {item.wr_comment}</Text>}
        {item.wr_link1 && <Icon name="link" style={[styles.wrMainArg, styles.wrLink]} />}
        {(item.normal_files.length > 0 || item.images.length > 0) && <Icon name="download" style={[styles.wrMainArg, styles.wrFile]} />}
      </View>
      <View style={styles.writeSubContainer}>
        <Text style={styles.wrSubArg}>{item.wr_name}</Text>
        <Text style={styles.wrSubArg}>조회수 {item.wr_hit}</Text>
        <Text style={styles.wrSubArg}>추천 {item.good}</Text>
        <Text style={styles.wrSubArg}>비추 {item.nogood}</Text>
        <Text style={styles.wrSubArg}>
          {(() => {
            const date = new Date(item.wr_datetime);
            return date.toISOString().slice(2, 10).replace(/-/g, '-');
          })()}
        </Text>
      </View>
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
    backgroundColor: '#cbe3e8',
    width: 16,
    height: 16,
    fontSize: 11,
  },
  wrLink: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#edd3fd',
    width: 16,
    height: 16,
    fontSize: 11,
  },
  wrFile: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#ffefb9',
    width: 16,
    height: 16,
    fontSize: 11,
  },
});

export default WriteListItem;