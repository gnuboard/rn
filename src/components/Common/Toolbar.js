import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants/theme';

export const WriteListToolbar = ({ bo_table }) => {
  const navigation = useNavigation();
  const { getThemedTextColor } = useTheme();
  const [ isSearchingActive, setIsSearchingActive ] = useState(false);

  const onSearchPress = () => {
    setIsSearchingActive(!isSearchingActive);
  }

  return (
    <View>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Icon name="search" size={24} color={getThemedTextColor()} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('WriteUpdate', {'bo_table': bo_table})}
        >
          <Icon name="create" size={24} color={getThemedTextColor()} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ellipsis-vertical" size={24} color={getThemedTextColor()} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[
          styles.searchInput,
          !isSearchingActive && {display: 'none'}
        ]} 
      />
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
  searchInput: {
    marginTop: 15,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border_gray,
  },
});