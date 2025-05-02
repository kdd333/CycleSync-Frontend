import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import ArrowLeftIcon from '../assets/icons/arrowleft.svg';
import TickIcon from '../assets/icons/tick.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config'; 

type WorkoutSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutSelection'>;
type WorkoutSelectionScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutSelection'>;

interface ExerciseType {
    id: string;
    name: string;
};

interface Exercise {
    id: number;
    name: string;
    exercise_type: ExerciseType; 
};

interface WorkoutExercise {
    id: number;
    exercise: Exercise;
    sets: number;
    reps: number;
    weight: number;
};

interface Workout {
    id: number;
    name: string;
    created_at: string;
    workout_exercises: WorkoutExercise[];
};

const WorkoutSelectionScreen = () => {
    const navigation = useNavigation<WorkoutSelectionScreenNavigationProp>();
    const route = useRoute<WorkoutSelectionScreenRouteProp>();
    const { selectedDate, onSelectWorkout } = route.params; // Get the selected date from navigation params
    const [workoutsList, setWorkoutsList] = useState<Workout[]>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetchWorkouts(); 
    }, []);

    const fetchWorkouts = async () => {
        setLoading(true); 
        const accessToken = await AsyncStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/workouts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setWorkoutsList(data); // Update workoutsList with the fetched data from API
            } else {
                console.log('Failed to fetch workouts:', response.status, response.statusText);
            }

        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false); 
        }
    };

    const handleSelectWorkout = () => {
        if (selectedWorkout) {
            // Log the selected workout for the selected date
            console.log(`Workout "${selectedWorkout.name}" logged for ${selectedDate}`);
            onSelectWorkout(selectedWorkout.id, selectedWorkout.name); // Pass the selected workout ID back to the CalendarScreen
            navigation.goBack(); // Return to the CalendarScreen
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon width={30} height={30} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F17CBB" />
                </View>
            ) : (
                <>
                    {/* Workout List */}
                    <FlatList
                        data={workoutsList}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.workoutItem}
                            onPress={() => setSelectedWorkout(item)}
                        >
                            <Text style={[styles.workoutText, selectedWorkout?.id === item.id && styles.selectedText]}>
                            {item.name}
                            </Text>
                            {selectedWorkout?.id === item.id && <TickIcon width={20} height={20} />}
                        </TouchableOpacity>
                        )}
                    />
            
                    {/* Select Workout Button */}   
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={[
                                styles.selectButton,
                                !selectedWorkout && styles.disabledButton, // Apply disabled style if no workout is selected
                            ]}
                            onPress={handleSelectWorkout}
                            disabled={!selectedWorkout} // Disable the button if no workout is selected
                        >
                            <Text style={styles.selectButtonText}>Select Workout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    topContainer: {
        marginTop: 40,
        marginBottom: 20,
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
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
        color: '#333',
        paddingVertical: 10,
    },
    selectedText: {
        color: '#F17CBB',
        fontWeight: 'bold',
    },
    selectButton: {
        backgroundColor: '#F17CBB',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#999999a1', 
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
    },
});

export default WorkoutSelectionScreen;