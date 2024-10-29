import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/theme/ThemeContext';

export const HeaderBackwardArrow = ({ navigation }) => {
  const { getThemedTextColor } = useTheme();
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Icon name="chevron-back-sharp" size={28} color={getThemedTextColor()} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 8,
    left: 2,
    zIndex: 1,
    padding: 10,
    height: 48,
    width: 48,
  },
});