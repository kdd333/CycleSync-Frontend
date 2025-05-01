// App.tsx
import React from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import { WorkoutProvider } from '../src/context/WorkoutContext';
import { Menu, MenuProvider } from 'react-native-popup-menu';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const fetchFonts = async () => {
  try {
    await Font.loadAsync({
      'LobsterTwo-Regular': require('./assets/fonts/LobsterTwo-Regular.ttf'),
      'LobsterTwo-Bold': require('./assets/fonts/LobsterTwo-Bold.ttf'),
    });
  } catch (error) {
    console.error('Error loading fonts:', error);
  }
};


const App = () => {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

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