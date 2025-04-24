import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrackingScreen from '../screens/TrackingScreen';
import CalendarScreen from '../screens/CalendarScreen';
import home from '../assets/icons/home.svg';
import homefilled from '../assets/icons/homefilled.svg';
import calendar from '../assets/icons/calendar.svg';
import calendarfilled from '../assets/icons/calendarfilled.svg';
import tracking from '../assets/icons/tracking.svg';
import trackingfilled from '../assets/icons/trackingfilled.svg';
import user from '../assets/icons/user.svg';
import userfilled from '../assets/icons/userfilled.svg';
import weight from '../assets/icons/weight.svg';
import weightfilled from '../assets/icons/weightfilled.svg';
import { SvgProps } from 'react-native-svg';
import { Alert, Image, StyleSheet, Text } from 'react-native';
import CycleSyncLight from '../assets/logo/CycleSyncLight.png';
import dotshorizontal from '../assets/icons/dotshorizontal.svg';
import { TouchableOpacity } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';

const Tab = createBottomTabNavigator();

const IconComponent = ({
  Icon,
  color,
  style,
  size = 28, // Default size
}: {
  Icon: React.FC<SvgProps>;
  color: string;
  style?: object;
  size?: number; 
}) => (
  <Icon
    width={size} 
    height={size} 
    fill={color}
    style={style}
  />
);

const BottomTabNavigator = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // call backend logout API to blacklist the refresh token
        const response = await fetch('http://192.168.1.182:8000/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, 
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            console.log('failed to logout on the server:', response.statusText);
            const errorData = await response.json();
            console.log('Error data:', errorData || 'Unknown error');
        } else {
            console.log('Logout successful on the server');
        }
      }
        // Clear tokens from AsyncStorage
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');

        // Navigate to login screen
        navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error); 
      Alert.alert('Error', 'An error occurred while logging out. Please try again.');
    }
  };

  const handleHelp = () => {
    navigation.navigate('Help'); 
  };

  return (
      <Tab.Navigator
        screenOptions={{
          headerTitle: '',
          headerStyle: {
              height: 120,
              elevation: 0,
              shadowOpacity: 0,
          },
          headerLeft: () => (
              <Image 
                  source={CycleSyncLight} 
                  style={{ width: 150, height: 50, marginLeft: 20, resizeMode: 'contain' }} 
              />
          ),
          headerRight: () => (
            <Menu>
              <MenuTrigger>
                <IconComponent Icon={dotshorizontal} color="black" style={{ marginRight: 20 }} />
              </MenuTrigger>
              <MenuOptions 
                customStyles={{
                  optionsContainer: {
                    padding: 10,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    elevation: 5,
                  },
                  optionText: {
                    fontSize: 16,
                    color: '#333',
                    paddingVertical: 10,
                  },
                }}>
                <MenuOption onSelect={handleHelp}>
                  <Text style={styles.menuOptionText}>Help</Text>
                </MenuOption>
                <MenuOption onSelect={handleLogout}>
                  <Text style={styles.menuOptionText}>Logout</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ),
          headerShadowVisible: false,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#fff',
          tabBarStyle: {
              backgroundColor: '#F17CBB',
              paddingVertical: 5,
              paddingTop: 10,
              height: 80,
          },
          tabBarShowLabel: true, 
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => <IconComponent Icon={focused ? homefilled : home} color='#F17CBB' />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ focused }) => <IconComponent Icon={focused ? calendarfilled : calendar} color='#F17CBB' />,
          }}
        />
        <Tab.Screen
          name="Tracking"
          component={TrackingScreen}
          options={{
            tabBarLabel: 'Workouts',
            tabBarIcon: ({ focused }) => <IconComponent Icon={focused ? weightfilled : weight} color='#F17CBB' size={32} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused }) => <IconComponent Icon={focused ? userfilled : user} color='#F17CBB' />,
          }}
        />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
  },
  menuOptionsContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
});


export default BottomTabNavigator;