import React, { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import { WorkoutProvider } from '../src/context/WorkoutContext';
import { MenuProvider } from 'react-native-popup-menu';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// const fetchFonts = async () => {
//   await Font.loadAsync({
//     'LobsterTwo-Regular': require('./assets/fonts/LobsterTwo-Regular.ttf'),
//     'LobsterTwo-Bold': require('./assets/fonts/LobsterTwo-Bold.ttf'),
//   });
// };

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        //await fetchFonts();
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        setFontLoaded(true);
        // Hide the splash screen once fonts are loaded
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!fontLoaded) {
    return null; // Keep the splash screen visible
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