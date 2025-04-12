import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import WorkoutCreationScreen from '../screens/WorkoutCreationScreen';
import ExerciseSelectionScreen from '../screens/ExerciseSelectionScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';
import WorkoutSelectionScreen from '../screens/WorkoutSelectionScreen';

type ExerciseType = {
  id: string;
  name: string;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  WorkoutCreation: undefined;
  ExerciseSelection: { onSelectExercise: (exercise: { id: string; name: string; exercise_type: ExerciseType}) => void };
  WorkoutDetails: { workoutId: number };
  WorkoutSelection: { selectedDate: string, onSelectWorkout: (workoutId: number, workoutName: string) => void };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="WorkoutCreation" component={WorkoutCreationScreen} />
      <Stack.Screen name="ExerciseSelection" component={ExerciseSelectionScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      <Stack.Screen name="WorkoutSelection" component={WorkoutSelectionScreen} />
      
    </Stack.Navigator>
  );
};

export default AppNavigator;