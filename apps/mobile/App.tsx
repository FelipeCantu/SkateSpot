import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastProvider } from './src/components/Toast';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#3b82f6',
            background: '#0a0a0a',
            card: '#0a0a0a',
            text: '#ffffff',
            border: 'rgba(255,255,255,0.1)',
            notification: '#ef4444',
          },
          fonts: {
            regular: { fontFamily: 'System', fontWeight: '400' },
            medium: { fontFamily: 'System', fontWeight: '500' },
            bold: { fontFamily: 'System', fontWeight: '700' },
            heavy: { fontFamily: 'System', fontWeight: '900' },
          },
        }}
      >
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
