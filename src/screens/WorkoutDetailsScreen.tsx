import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditIcon from '../assets/icons/edit.svg';
import ArrowLeftIcon from '../assets/icons/arrowleft.svg';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config'; 

type WorkoutDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutDetails'>;
type WorkoutDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutDetails'>;

type ExerciseType = {
    id: string;
    name: string;
};

type Exercise = {
    id: string;
    name: string;
    exercise_type: ExerciseType;
};

const WorkoutDetailsScreen = () => {
    const navigation = useNavigation<WorkoutDetailsScreenNavigationProp>();
    const route = useRoute<WorkoutDetailsScreenRouteProp>();
    const { workoutId } = route.params;
    const [workoutName, setWorkoutName] = useState('');
    const [workoutExercises, setWorkoutExercises] = useState<{ id: string; exercise: Exercise; weight: string; sets: string; reps: string }[]>([]);

    useEffect(() => {
        fetchWorkoutDetails();
    }, [workoutId]);

    const fetchWorkoutDetails = async () => {
        // Fetch workout details from the backend using the workout id
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("serialized data received:", data);  // debugging
                setWorkoutName(data.name);
                setWorkoutExercises(
                    (data.workout_exercises).map((workout_exercise: any) => ({
                        id: workout_exercise.id.toString(),
                        exercise: workout_exercise.exercise,
                        weight: workout_exercise.weight.toString(),
                        sets: workout_exercise.sets.toString(),
                        reps: workout_exercise.reps.toString(),
                    }))
                );

                console.log('fetchWorkoutDetails() function data:', data);
            } else {
                console.log('Failed to fetch workout details:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching workout details:', error);
        }
    };

    const handleAddExercise = () => {
        // Add Exercise: Navigate to Exercise Selection Screen
        navigation.navigate('ExerciseSelection', {
            onSelectExercise: (exercise: { id: string; name: string; exercise_type: ExerciseType}) => {
                setWorkoutExercises([...workoutExercises, { id: workoutId.toString(), exercise: exercise, weight: '', sets: '', reps: '' }]);
            },
        });
    };

    const handleEditExercise = (index: number) => {
        // Open Edit Menu for Exercise (Change or Remove)
        Alert.alert(
            'Edit Exercise',
            'Choose an option:',
            [
                {
                    text: 'Change Exercise',
                    onPress: () => handleChangeExercise(index),
                },
                {
                    text: 'Remove Exercise',
                    onPress: () => handleRemoveExercise(index),
                    style: 'destructive',
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleChangeExercise = (index: number) => {
        // Change Exercise: Navigate and update the exercise
        navigation.navigate('ExerciseSelection', {
            onSelectExercise: (newExercise: { id: string; name: string; exercise_type: ExerciseType }) => {
                const updatedExercises = [...workoutExercises];
                updatedExercises[index].exercise.id = newExercise.id;
                updatedExercises[index].exercise.name = newExercise.name;
                setWorkoutExercises(updatedExercises);
            },
        });
    };

    const handleRemoveExercise = (index: number) => {
        // Remove Exercise: Filter out the exercise at the given index
        const updatedExercises = workoutExercises.filter((_, i) => i !== index);
        setWorkoutExercises(updatedExercises);
    };

    const handleSaveWorkout = async () => {
        // Validate workout name and exercises
        if (!workoutName.trim()) {
            Alert.alert('Error', 'Please enter a workout name.');
            return;
        }
        if (workoutExercises.length === 0) {
            Alert.alert('Error', 'Please add at least one exercise.');
            return;
        }

        const requestBody = {
            name: workoutName,
            workout_exercises: workoutExercises.map((workoutExercise) => ({
                id: workoutExercise.id,   
                exerciseId: workoutExercise.exercise.id,
                weight: parseFloat(workoutExercise.weight) || 0,
                sets: parseInt(workoutExercise.sets) || 0,
                reps: parseInt(workoutExercise.reps) || 0,
            })),
        };

        console.log('PUT Request Body:', requestBody);

        // PUT request to Save the workout to the backend:
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                Alert.alert('Success', 'Workout saved successfully!');
                navigation.goBack(); 
            } else {
                const errorData = await response.json();
                console.log('Failed to save workout:', response.status, response.statusText, errorData);
                Alert.alert('Error', 'Failed to save workout. Please try again.');
            }
        } catch (error) {
            console.error('Error saving workout:', error);
            Alert.alert('Error', 'Failed to save workout. Please try again.');
        }
    };

    // Return to the previous screen
    const handleReturn = () => {
        navigation.goBack(); 
    };

    return (
        <View style={styles.container}>
            {/* Save and Return Buttons */}
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleReturn}>
                    <ArrowLeftIcon width={30} height={30} />
                </TouchableOpacity>
                <Button title="Save" onPress={handleSaveWorkout} size='small' />
            </View>
            
            {/* Scrollable Section (Workout Name & Exercises) */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Workout Name Input */}
                <View style={styles.workoutNameContainer}>
                    <Text style={styles.nameLabel}>Name:</Text>
                    <TextInput
                        style={styles.nameInput}
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        placeholder="Enter workout name"
                    />
                </View>

                {/* List of Exercises */}
                {workoutExercises.map((workoutExercise, index) => (
                    <View key={index} style={styles.exerciseContainer}>
                        <View style={styles.exerciseContainerTop}>
                            <Text style={styles.exerciseName}>{workoutExercise.exercise.name}</Text>
                            <TouchableOpacity style={styles.editExerciseButton} onPress={() => handleEditExercise(index)}>
                                <EditIcon width={20} height={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.exerciseRowContainer}>
                            <Text style={styles.label}>Weight (Kg):</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={workoutExercise.weight}
                                onChangeText={(text) => {
                                const updatedExercises = [...workoutExercises];
                                updatedExercises[index].weight = text;
                                setWorkoutExercises(updatedExercises);
                                }}
                                placeholder="Enter weight"
                            />
                        </View>

                        <View style={styles.exerciseRowContainer}>
                            <Text style={styles.label}>Sets:</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={workoutExercise.sets}
                                onChangeText={(text) => {
                                const updatedExercises = [...workoutExercises];
                                updatedExercises[index].sets = text;
                                setWorkoutExercises(updatedExercises);
                                }}
                                placeholder="Enter sets"
                            />
                        </View>

                        <View style={styles.exerciseRowContainer}>
                            <Text style={styles.label}>Reps:</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={workoutExercise.reps}
                                onChangeText={(text) => {
                                const updatedExercises = [...workoutExercises];
                                updatedExercises[index].reps = text;
                                setWorkoutExercises(updatedExercises);
                                }}
                                placeholder="Enter reps"
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Add Exercise Button */}
            <View style={styles.bottomContainer}>
                <Button title="Add Exercise" onPress={handleAddExercise} />
            </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    nameLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    nameInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    workoutNameContainer: {
        backgroundColor: '#EFF0F1',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    exerciseContainer: {
        padding: 15,
        backgroundColor: '#EFF0F1',
        //borderWidth: 1,
        //borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
    },
    exerciseContainerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
        textAlign: 'right',
        width: 100,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    editExerciseButton: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#F17CBB',
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    exerciseRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
    },
});

export default WorkoutDetailsScreen;