import React from 'react';
import { SafeAreaView, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/auth/AuthContext';
import { WriteListRefreshProvider, WriteRefreshProvider } from './src/context/writes/RefreshContext';
import { SearchWritesProvider } from './src/context/writes/SearchWritesContext';
import { CacheWritesProvider } from './src/context/writes/CacheWritesContext';
import { ThemeProvider } from './src/context/theme/ThemeContext';
import { BoardsProvider } from './src/context/boards/BoardsContext';

const App = () => {
  return (
    <AuthProvider>
      <CacheWritesProvider>
        <ThemeProvider>
        <BoardsProvider>
          <WriteListRefreshProvider>
          <WriteRefreshProvider>
          <SearchWritesProvider>
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <AppNavigator />
            </TouchableWithoutFeedback>
          </SafeAreaView>
          </SearchWritesProvider>
          </WriteRefreshProvider>
          </WriteListRefreshProvider>
        </BoardsProvider>
        </ThemeProvider>
      </CacheWritesProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;