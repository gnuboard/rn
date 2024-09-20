import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedComponent, { useTheme } from '../../context/theme/ThemeContext';

const SettingsScreen = () => {
  const { getThemedBackgroundColor } = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: getThemedBackgroundColor()}]}>
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