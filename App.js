import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/auth/AuthContext';
import { WriteRefreshProvider } from './src/context/refresh/write/RefreshContext';
import { RefreshProvider } from './src/auth/context/RefreshContext';

const App = () => {
  return (
    <RefreshProvider>
      <AuthProvider>
        <WriteRefreshProvider>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
          </SafeAreaView>
        </WriteRefreshProvider>
      </AuthProvider>
    </RefreshProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;