import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/auth/AuthContext';
import { WriteListRefreshProvider, WriteRefreshProvider } from './src/context/refresh/write/RefreshContext';

const App = () => {
  return (
    <AuthProvider>
      <WriteListRefreshProvider>
      <WriteRefreshProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
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