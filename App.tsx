/**
 * Pancito de Vida - Restaurant Order Management App
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppProvider} from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
