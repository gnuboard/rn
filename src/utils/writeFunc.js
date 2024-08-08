export function readWrite(
  bo_table, write, setModalVisible, navigation
) {
  if (write.wr_option.includes('secret')) {
    setModalVisible(true);
  } else {
    navigation.navigate('Write', {bo_table, 'wr_id': write.wr_id});
  }
}