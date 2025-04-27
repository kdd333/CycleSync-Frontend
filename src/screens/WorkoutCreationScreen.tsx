import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditIcon from '../assets/icons/edit.svg';
import ArrowLeftIcon from '../assets/icons/arrowleft.svg';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutCreation'>;

const WorkoutCreationScreen = () => {
    const navigation = useNavigation<WorkoutScreenNavigationProp>();
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState<{ id:String; name: string; weight: string; sets: string; reps: string }[]>([]);

    // Add Exercise: Navigate to Exercise Selection Screen
    const handleAddExercise = () => {
        navigation.navigate('ExerciseSelection', {
            onSelectExercise: (exercise: { id: string; name: string }) => {
                setExercises([...exercises, { id: exercise.id, name: exercise.name, weight: '', sets: '', reps: '' }]);
            },
        });
    };

    // Open Edit Menu for Exercise (Change or Remove)
    const handleEditExercise = (index: number) => {
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

    // Change Exercise: Navigate and update the exercise
    const handleChangeExercise = (index: number) => {
        navigation.navigate('ExerciseSelection', {
            onSelectExercise: (newExercise: { id: string; name: string }) => {
                const updatedExercises = [...exercises];
                updatedExercises[index].id = newExercise.id; 
                updatedExercises[index].name = newExercise.name;
                setExercises(updatedExercises);
            },
        });
    };

    // Remove Exercise: Filter out the exercise at the given index
    const handleRemoveExercise = (index: number) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
    };

    // Save Workout: Validate and save the workout
    const handleSaveWorkout = async () => {
        if (!workoutName.trim()) {
            Alert.alert('Error', 'Please enter a workout name.');
            return;
        }

        if (exercises.length === 0) {
            Alert.alert('Error', 'Please add at least one exercise.');
            return;
        }

        console.log('Workout Name:', workoutName);
        console.log('Exercises:', exercises);

        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch('https://cyclesync-backend-production.up.railway.app/api/workouts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: workoutName,
                    exercises: exercises.map((exercise) => ({
                        id: exercise.id,
                        name: exercise.name,
                        weight: parseFloat(exercise.weight) || 0,
                        sets: parseInt(exercise.sets) || 0,
                        reps: parseInt(exercise.reps) || 0,
                    })),
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Workout created successfully!');
                navigation.goBack(); // Return to the previous screen after saving
            } else {
                const errorData = await response.json();
                console.log('Server error saving workout:', errorData);
                Alert.alert('Error', errorData.error || 'An error occurred while saving the workout.');
            }
        } catch (error) {
            console.error('Error saving workout:', error);
            Alert.alert('Error', 'An error occurred while saving the workout. Please try again.');
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
                {exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseContainer}>
                        <View style={styles.exerciseContainerTop}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <TouchableOpacity style={styles.editExerciseButton} onPress={() => handleEditExercise(index)}>
                                <EditIcon width={20} height={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.exerciseRowContainer}>
                            <Text style={styles.label}>Weight (Kg):</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={exercise.weight}
                                onChangeText={(text) => {
                                const updatedExercises = [...exercises];
                                updatedExercises[index].weight = text;
                                setExercises(updatedExercises);
                                }}
                                placeholder="Enter weight"
                            />
                        </View>

                        <View style={styles.exerciseRowContainer}>
                            <Text style={styles.label}>Sets:</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={exercise.sets}
                                onChangeText={(text) => {
                                const updatedExercises = [...exercises];
                                updatedExercises[index].sets = text;
                                setExercises(updatedExercises);
                                }}
                                placeholder="Enter sets"
                            />
                        </View>

                        <View style={styles.exerciseRowContainer}>
                            <Text style={styles.label}>Reps:</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={exercise.reps}
                                onChangeText={(text) => {
                                const updatedExercises = [...exercises];
                                updatedExercises[index].reps = text;
                                setExercises(updatedExercises);
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

export default WorkoutCreationScreen;