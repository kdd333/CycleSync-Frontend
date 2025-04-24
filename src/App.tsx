// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import { WorkoutProvider } from '../src/context/WorkoutContext';
import { Menu, MenuProvider } from 'react-native-popup-menu';

const App = () => {
  return (
    <MenuProvider>
      <WorkoutProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </WorkoutProvider>
    </MenuProvider>
  );
};

export default App;