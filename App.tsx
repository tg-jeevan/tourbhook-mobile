import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/core/navigation/RootNavigator';
import { AuthProvider } from './src/core/auth/AuthContext';
import { queryClient } from './src/core/query/queryClient';


// Enforce hidden status bar globally and prevent screens from restoring it
StatusBar.setHidden(true);
if (typeof StatusBar.setHidden === 'function') {
  const originalSetHidden = StatusBar.setHidden;
  StatusBar.setHidden = (hidden: boolean, animation?: 'none' | 'fade' | 'slide') => {
    return originalSetHidden(true, animation);
  };
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar hidden={true} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

