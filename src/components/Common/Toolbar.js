import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export const WriteListToolbar = ({ bo_table }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="search" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('WriteUpdate', {'bo_table': bo_table})}
      >
        <Icon name="create" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="ellipsis-vertical" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginHorizontal: 8,
  },
});