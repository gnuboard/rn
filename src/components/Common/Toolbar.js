import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchInput } from './Inputs';

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
      <SearchInput isSearchingActive={isSearchingActive} />
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