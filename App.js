import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/auth/AuthContext';
import { WriteListRefreshProvider, WriteRefreshProvider } from './src/context/writes/RefreshContext';
import { CacheWritesProvider } from './src/context/writes/CacheWritesContext';
import { ThemeProvider } from './src/context/theme/ThemeContext';

const App = () => {
  return (
    <AuthProvider>
      <CacheWritesProvider>
        <ThemeProvider>
          <WriteListRefreshProvider>
          <WriteRefreshProvider>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
          </SafeAreaView>
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