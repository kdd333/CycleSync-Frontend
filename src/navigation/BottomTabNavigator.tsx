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
import { SvgProps } from 'react-native-svg';
import { Image } from 'react-native';
import CycleSyncLight from '../assets/logo/CycleSyncLight.png';
import dotshorizontal from '../assets/icons/dotshorizontal.svg';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

const IconComponent = ({ Icon, color, style }: { Icon: React.FC<SvgProps>, color: string, style?: object }) => (
    <Icon width={28} height={28} fill={color} style={style} />
);

const BottomTabNavigator = () => {
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
            <TouchableOpacity onPress={() => console.log("Three dots pressed!")}>
                <IconComponent Icon={dotshorizontal} color="black" style={{ marginRight: 20 }} />
            </TouchableOpacity>
        ),
        headerShadowVisible: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#F17CBB',
        tabBarStyle: {
            backgroundColor: '#F17CBB',
            paddingVertical: 5,
            paddingTop: 10,
            height: 75,
        },
        tabBarShowLabel: false, 
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
          tabBarLabel: 'Tracking',
          tabBarIcon: ({ focused }) => <IconComponent Icon={focused ? trackingfilled : tracking} color='#F17CBB' />,
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

export default BottomTabNavigator;