export function readWrite(
  bo_table, write, setModalVisible, setModalWrId, navigation
) {
  if (write.wr_option.includes('secret')) {
    setModalWrId(write.wr_id);
    setModalVisible(true);
  } else {
    navigation.navigate('Write', {bo_table, 'wr_id': write.wr_id});
  }
}