import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SleepEmojiIcon from '../assets/icons/emojisleep.svg';
import ChevronRightIcon from '../assets/icons/chevronright.svg';
import ChevronLeftIcon from '../assets/icons/chevronleft.svg';
import DottedCircleIcon from '../assets/icons/dottedcircle.svg';
import EditIcon from '../assets/icons/edit.svg';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DayType = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const calendarTheme = {
  calendarBackground: '#fff',
  dayTextColor: '#333',
  todayTextColor: '#fff',
  todayBackgroundColor: '#999999a1',
  selectedDayBackgroundColor: '#F17CBB',
  selectedDayTextColor: '#fff',
  arrowColor: '#fff',
  monthTextColor: '#000',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: 'bold',
};

const CalendarScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'WorkoutSelection'>>();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isPeriodLogged, setIsPeriodLogged] = useState<Boolean>(false);
  const [loggedDates, setLoggedDates] = useState<{ [key: string]: any}>({});
  const [workoutsByDate, setWorkoutsByDate] = useState<{ [key: string]: any}>({});
  const cycleData = {
    currentPhase: 'Menstrual',
    cycleDay: '3',
  };

  useEffect(() => {
    fetchWorkoutLogs(); 
    fetchPeriodDates();
  }, []);

  const fetchWorkoutLogs = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://192.168.1.182:8000/api/workout-logs/', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
          },
      });

      if (response.ok) {
        const data = await response.json();
        const logs = data.reduce((acc: { [key: string]: string }, log: any) => {
          acc[log.date] = log.workout_name;
          return acc;
        }, {});
        setWorkoutsByDate(logs);
      } else {
        console.log('Failed to fetch workout logs:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching workout logs:', error);
    }
  };

  const fetchPeriodDates = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://192.168.1.182:8000/api/period-dates/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const markedDates = data.period_dates.reduce(
          (acc: { [key: string]: { selected: boolean; selectedColor: string } }, date: string) => {
          acc[date] = { selected: true, selectedColor: '#F17CBB' };
          return acc;
        }, {});
        setLoggedDates(markedDates);
      } else {
        console.log('Failed to fetch period dates:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching period dates:', error);
    }
  };

  const handleLogPeriod = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://192.168.1.182:8000/api/log-period/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedDates((prev) => ({
          ...prev,
          [selectedDate]: { selected: true, selectedColor: '#F17CBB' },
        }));
        Alert.alert('Success', data.message);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to log period.');
      }
    } catch (error) {
      console.error('Error logging period:', error);
      Alert.alert('Error', 'Failed to log period. Please try again.');
    }
  };

  const handleAddWorkout = () => {
    // Navigate to workout selection screen
    navigation.navigate('WorkoutSelection', { 
      selectedDate,
      onSelectWorkout: async (workoutId: number, workoutName: string) => {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const response = await fetch('http://192.168.1.182:8000/api/workout-logs/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              date: selectedDate,
              workout: workoutId,
            }),
          });

          if (response.ok) {
            setWorkoutsByDate((prevWorkouts) => ({
              ...prevWorkouts,
              [selectedDate]: workoutName,
            }));
          } else {
            console.log('Failed to log workout:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error logging workout:', error);
        }
      },
    });
  };

  const handleDeleteWorkoutLog = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`http://192.168.1.182:8000/api/workout-logs/`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
              date: selectedDate, 
          }),
      });

      if (response.ok) {
        // Remove the workout from the state
        setWorkoutsByDate((prevWorkouts) => {
          const updatedWorkouts = { ...prevWorkouts };
          delete updatedWorkouts[selectedDate];
          return updatedWorkouts;
        });
        Alert.alert('Success', 'Workout log deleted successfully!');
      } else {
        console.log('Failed to delete workout log:', response.status, response.statusText);
        Alert.alert('Error', 'Failed to delete workout log. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting workout log:', error);
      Alert.alert('Error', 'Failed to delete workout log. Please try again.');
    }
  };

  const handleEditWorkout = () => {
    Alert.alert(
      'Edit Workout',
      'What would you like to do?',
      [
        {text: 'Change Workout', onPress: () => handleAddWorkout()},
        {text: 'Remove Workout', style: 'destructive', onPress: () => handleDeleteWorkoutLog()},
        {text: 'Cancel', style: 'cancel'}
      ]
    );
  };


  // Helper function to format date string to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to get day of week from date string
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Mark the selected date on the calendar
  const markedDates = {
    ...loggedDates,
    [selectedDate]: {
      selected: true,
    },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Current Phase and Cycle Day */}
        <View style={styles.topContainer}>
          <Text style={styles.currentPhaseText}>Current Phase: {cycleData.currentPhase}</Text>
          <View style={styles.pinkCircle}>
            <Text style={styles.pinkCircleText}>Day:</Text>
            <Text style={styles.pinkCircleText}>{cycleData.cycleDay}</Text>
          </View>
        </View>

        <View style={styles.mainContainer}>
          {/* Calendar */}
          <View style={styles.calendarContainer}>
            <Calendar
                current={selectedDate}
                onDayPress={(day: DayType) => {
                  setSelectedDate(day.dateString);
                  setIsPeriodLogged(loggedDates[day.dateString] ? true : false); 
                }}
                theme={calendarTheme}
                markedDates={markedDates}
                renderArrow={(direction: 'left' | 'right') =>
                  direction === 'left' ? (
                    <ChevronLeftIcon width={25} height={25} />
                  ) : (
                    <ChevronRightIcon width={25} height={25} />
                  )
                }
              />
          </View>

          <View style={styles.bottomContainer}>
            {/* Selected Date */}
            <View style={styles.selectedDateContainer}>
              <Text style={styles.sectionTitle}>{getDayOfWeek(selectedDate)} </Text>
              <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
            </View>

            {/* Log Buttons */}
            <View style={styles.buttonContainer}>
              {workoutsByDate[selectedDate] ? (
                <TouchableOpacity style={ isPeriodLogged ? styles.loggedPeriodButton : styles.logPeriodButton } onPress={handleLogPeriod} >
                  <Text style={styles.logPeriodButtonText}>{isPeriodLogged ? 'Period Logged!' : 'Log Period'}</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity style={ isPeriodLogged ? styles.loggedPeriodButton : styles.logPeriodButton } onPress={handleLogPeriod} >
                    <Text style={styles.logPeriodButtonText}>{isPeriodLogged ? 'Period Logged!' : 'Log Period'}</Text>
                  </TouchableOpacity>
                  <Button title="Add Workout" onPress={handleAddWorkout} size='small' />
                </View>
              )}
            </View>

            {/* Workout Section */}
            <View style={styles.workoutSection}>
              {workoutsByDate[selectedDate] ? (
                <View style={styles.selectedWorkoutSection}>
                  <View style={styles.selectedWorkoutSection}>
                    <Text style={styles.selectedWorkoutTitle}>Selected Workout:  </Text>
                    <View style={styles.selectedWorkoutContainer}>
                      <Text style={styles.selectedWorkoutText}>{workoutsByDate[selectedDate]}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editWorkoutButton} onPress={handleEditWorkout}>
                    <EditIcon width={20} height={20} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.workoutMainSection}>
                  <SleepEmojiIcon width={40} height={40} />
                  <Text style={styles.noWorkoutText}>No workout logged for this day</Text>
                </View>
              )}
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topContainer: {
    alignItems: 'center',
  },
  currentPhaseText: {
    fontSize: 18,
    marginBottom: 20,
  },
  pinkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F17CBB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinkCircleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  mainContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 20,
  },
  calendarContainer: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  bottomContainer: {
    padding: 20,
  },
  selectedDateContainer: {
    color: '#333',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#999',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  workoutSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logPeriodButton: {
    backgroundColor: '#F17CBB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logPeriodButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loggedPeriodButton: {
    backgroundColor: '#999999a1',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  workoutMainSection: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedWorkoutSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedWorkoutTitle: {
    fontSize: 15,
  },
  selectedWorkoutContainer: {
    backgroundColor: '#F4F4F5',
    padding: 10,
    borderRadius: 10,
  },
  selectedWorkoutText: {
    color: '#000',
    fontSize: 16,
  },
  editWorkoutButton: {
    marginLeft: 'auto',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#F17CBB',
  },
});

export default CalendarScreen;