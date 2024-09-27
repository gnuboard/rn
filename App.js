import React from 'react';
import { SafeAreaView, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/auth/AuthContext';
import { WriteListRefreshProvider, WriteRefreshProvider } from './src/context/writes/RefreshContext';
import { SearchWritesProvider } from './src/context/writes/SearchWritesContext';
import { CacheWritesProvider } from './src/context/writes/CacheWritesContext';
import { ThemeProvider } from './src/context/theme/ThemeContext';

const App = () => {
  return (
    <AuthProvider>
      <CacheWritesProvider>
        <ThemeProvider>
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