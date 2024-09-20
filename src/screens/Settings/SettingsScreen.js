import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedComponent, { useTheme } from '../../context/theme/ThemeContext';

const SettingsScreen = () => {
  const { bgThemedColor } = useTheme();

  return (
    <View style={[styles.container, bgThemedColor]}>
      <View style={styles.itemContainer}>
        <ThemedComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: 100,
  },
});

export default SettingsScreen;