import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/theme/ThemeContext';
import { Styles } from '../../styles/styles';

export const HeaderBackwardArrow = ({ navigation }) => {
  const { getThemedTextColor } = useTheme();
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Icon name="chevron-back-sharp" size={28} color={getThemedTextColor()} />
    </TouchableOpacity>
  );
}

const styles = new Styles.Arrow();