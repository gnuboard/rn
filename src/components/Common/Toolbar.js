import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/theme/ThemeContext';
import { useSearchWrites } from '../../context/writes/SearchWritesContext';
import { useHandleWrite } from '../../utils/hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchInput } from './Inputs';
import { Styles } from '../../styles/styles';

export const WriteListToolbar = ({ bo_table }) => {
  const navigation = useNavigation();
  const { getThemedTextColor } = useTheme();
  const { isSearchInputActive, setIsSearchInputActive } = useSearchWrites();
  const [ searchAllowed, setSearchAllowed ] = useState(false);
  const [ writeAllowed, setWriteAllowed ] = useState(false);
  const { checkSearchWriteAllowed, checkCreateWriteAllowed } = useHandleWrite();

  useEffect(() => {
    checkSearchWriteAllowed(bo_table, setSearchAllowed);
    checkCreateWriteAllowed(bo_table, setWriteAllowed);
    setIsSearchInputActive(false);
  }, [bo_table]);

  useEffect(() => {
    if (!isSearchInputActive) {
      Keyboard.dismiss();
    }
  }, [isSearchInputActive]);

  const onSearchPress = () => {
    setIsSearchInputActive(!isSearchInputActive);
  }

  return (
    <View>
      <View style={styles.toolbar}>
        {searchAllowed && (
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Icon name="search" size={24} color={getThemedTextColor()} />
          </TouchableOpacity>
        )}
        {writeAllowed && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('WriteUpdate', {'bo_table': bo_table})}
          >
            <Icon name="create" size={24} color={getThemedTextColor()} />
          </TouchableOpacity>
        )}
      </View>
      <SearchInput onetable={bo_table}/>
    </View>
  );
};

const styles = new Styles.Toolbar();