import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/auth/AuthContext';
import { WriteListRefreshProvider, WriteRefreshProvider } from './src/context/writes/RefreshContext';
import { CacheWritesProvider } from './src/context/writes/CacheWritesContext';

const App = () => {
  return (
    <AuthProvider>
      <WriteListRefreshProvider>
      <WriteRefreshProvider>
      <CacheWritesProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      </CacheWritesProvider>
      </WriteRefreshProvider>
      </WriteListRefreshProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;