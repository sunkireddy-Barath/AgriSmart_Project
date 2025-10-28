import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n/i18n';
import VoiceAssistant from './src/components/VoiceAssistant';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
          <VoiceAssistant />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}
