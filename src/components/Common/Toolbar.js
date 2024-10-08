import { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/theme/ThemeContext';
import { useAuth } from '../../context/auth/AuthContext';
import { useBoards } from '../../context/boards/BoardsContext';
import { useSearchWrites } from '../../context/writes/SearchWritesContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchInput } from './Inputs';

export const WriteListToolbar = ({ bo_table }) => {
  const navigation = useNavigation();
  const { getThemedTextColor } = useTheme();
  const { getCurrentUserData } = useAuth();
  const { boardsConfig } = useBoards();
  const { isSearchInputActive, setIsSearchInputActive } = useSearchWrites();
  const [ writeAllowed, setWriteAllowed ] = useState(false);

  useEffect(() => {
    checkWriteAllowed();
  }, [bo_table]);

  useEffect(() => {
    if (!isSearchInputActive) {
      Keyboard.dismiss();
    }
  }, [isSearchInputActive]);

  const checkWriteAllowed = async () => {
    const userData = await getCurrentUserData();
    const { bo_write_level } = boardsConfig[bo_table];
    if ((bo_write_level == 1) || (userData && userData.mb_level >= bo_write_level)) {
      setWriteAllowed(true);
    }
  }

  const onSearchPress = () => {
    setIsSearchInputActive(!isSearchInputActive);
  }

  return (
    <View>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Icon name="search" size={24} color={getThemedTextColor()} />
        </TouchableOpacity>
        {writeAllowed && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('WriteUpdate', {'bo_table': bo_table})}
          >
            <Icon name="create" size={24} color={getThemedTextColor()} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ellipsis-vertical" size={24} color={getThemedTextColor()} />
        </TouchableOpacity>
      </View>
      <SearchInput onetable={bo_table}/>
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