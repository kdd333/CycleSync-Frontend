// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import { WorkoutProvider } from '../src/context/WorkoutContext';

const App = () => {
  return (
    <WorkoutProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </WorkoutProvider>
  );
};

export default App;