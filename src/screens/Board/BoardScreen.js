import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BoardListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Board List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BoardListScreen;