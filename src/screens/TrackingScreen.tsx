import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import AddCircleIcon from '../assets/icons/addcircle.svg';
import ChevronRightIcon from '../assets/icons/chevronright.svg';
import EmojiSleepIcon from '../assets/icons/emojisleep.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Workout {
  id: number;
  name: string;
  exercises: string[];
}

const TrackingScreen: React.FC = () => {
  const navigation = useNavigation<TrackingScreenNavigationProp>();
  const [ workoutList, setWorkoutList ] = useState<Workout[]>([]);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ selectedWorkoutId, setSelectedWorkoutId ] = useState<number | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://192.168.1.182:8000/api/workouts/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched workouts:', data);
        setWorkoutList(data);  // Update workoutList with the fetched data from API
      } else {
        console.log('Failed to fetch workouts:', response.status, response.statusText);
        Alert.alert('Error fetching workouts', 'Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      Alert.alert('Error fetching workouts', 'Please try again later.');
    }
  };

  const deleteWorkout = async (workoutId: number) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`http://192.168.1.182:8000/api/workouts/${workoutId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        Alert.alert('Workout deleted successfully!');
        fetchWorkouts(); // Refresh workout list after deletion
      } else {
        console.log('Failed to delete workout:', response.status, response.statusText);
        Alert.alert('Error deleting workout', 'Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      Alert.alert('Error deleting workout', 'Please try again later.');
    }
  };

  const showOptionsAlert = (workoutId: number) => {
    Alert.alert(
      'Options',
      'What would you like to do?',
      [
        {
          text: 'Delete Workout',
          style: 'destructive',
          onPress: () => confirmDeleteWorkout(workoutId),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteWorkout = (workoutId: number) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteWorkout(workoutId) },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true); // Show the refresh indicator
    await fetchWorkouts(); // Fetch the latest workouts
    setRefreshing(false); // Hide the refresh indicator
  };

  return (
    <View style={styles.container}>
      {/* Title and New Workout Button */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Workouts:</Text>
        <TouchableOpacity 
          style={styles.newButton} 
          onPress={() => navigation.navigate('WorkoutCreation')}
        >
          <Text style={styles.newButtonText}>New</Text>
          <AddCircleIcon width={20} height={20} fill="white" />
        </TouchableOpacity>
      </View>

      {/* List of Workouts */}
      <FlatList 
        data={workoutList}
        keyExtractor={(item: Workout) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <EmojiSleepIcon width={50} height={50} />
            <Text style={styles.emptyListText}>No workouts created</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.workoutItem} 
            onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id })}
            onLongPress={() => showOptionsAlert(item.id)} 
          >
            <Text style={styles.workoutText}>{item.name}</Text>
            <ChevronRightIcon width={30} height={30} fill="#EFF0F1" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  newButton: {
    flexDirection: 'row',
    backgroundColor: '#F17CBB',
    padding: 10,
    borderRadius: 10,
  },
  newButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
  },
  emptyListText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  workoutItem: {
    backgroundColor: '#EFF0F1',
    padding: 15,
    marginVertical: 6,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutText: {
    fontSize: 18,
    padding: 10,
  },
});

export default TrackingScreen;
