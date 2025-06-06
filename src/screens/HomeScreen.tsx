import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, Pressable, ActivityIndicator } from 'react-native';
import { SvgProps } from 'react-native-svg';
import emojisleep from '../assets/icons/emojisleep.svg';
import warningcircle from '../assets/icons/warningcircle.svg';
import CycleOverviewContainer from '../components/CycleOverviewContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const IconComponent = ({ Icon, color, size, style }: { Icon: React.FC<SvgProps>, color: string, size?: number, style?: object }) => (
    <Icon width={size} height={size} fill={color} style={style} />
);

type ExerciseType = {
    id: number;
    name: string;
};

type Exercise = {
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
    warning: string;
};

interface Workout {
    id: number;
    name: string;
    created_at: string;
    workout_exercises: WorkoutExercise[];
};

interface WorkoutLog {
    id: number;
    date: string;
    workout: number;
    workout_name: string;
};

const HomeScreen = () => {
    const [dailyMessage, setDailyMessage] = useState<string>('');
    const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
    const [workoutDetails, setWorkoutDetails] = useState<Workout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWarning, setSelectedWarning] = useState<string | null>(null);

    useEffect(() => {
        fetchDailyCycleMessage();
        fetchWorkoutLog();
    }, []);

    const handleWarningPress = (warning: string) => {
        setSelectedWarning(warning);    
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedWarning(null);
    };

    const fetchDailyCycleMessage = async () => { 
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/cycle-data/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDailyMessage(data.daily_message || "");

            } else {
                console.log('Failed to fetch cycle data:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching cycle data:', error);
        }
    };

    const fetchWorkoutLog = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            const response = await fetch(`${API_BASE_URL}/api/workout-logs/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const todayLog = data.find((log: WorkoutLog) => log.date === today);

                if (todayLog) {
                    setWorkoutLog(todayLog);
                    await fetchWorkoutDetails(todayLog.workout);
                } else {
                    setWorkoutLog(null);
                    setWorkoutDetails(null);
                }
            }
        } catch (error) {
            console.error('Error fetching workout log:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWorkoutDetails = async (workoutId: number) => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setWorkoutDetails(data);
            } else {
                console.error('Failed to fetch workout details:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching workout details:', error);
        } 
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchWorkoutLog();
        await fetchDailyCycleMessage();
        setRefreshTrigger((prev) => (!prev)); // Trigger re-render of CycleOverviewContainer
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
            <View>
                {/* Cycle Phase Overview Section */}
                <CycleOverviewContainer refreshTrigger={refreshTrigger} />
                
                {/* Cycle Phase Message Section */}
                <View style={styles.cycleMessageSection}>
                    <Text style={styles.cycleMessageText}>{dailyMessage}</Text>    
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Workout Section */}
                <View style={styles.workoutSection}>
                    <View style={styles.textRow}>
                        {workoutDetails ? (
                            <>
                                <Text style={styles.sectionTitle}>Today's Workout:</Text>
                                <Text style={styles.workoutTitle}>{workoutDetails.name}</Text>
                            </>
                        ) : (
                            <View>
                                <Text style={styles.sectionTitle}>Today's Workout:</Text>
                            </View>
                        )}

                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#F17CBB"  />     
                        </View>                       
                    ) : workoutDetails ? (
                        <>
                            {workoutDetails.workout_exercises.map((exercise, index) => (
                                <View key={index} style={styles.exerciseContainer}>
                                    <View style={styles.exerciseTitleRow}>
                                        {exercise.warning ? (
                                            <>
                                                <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
                                                <TouchableOpacity onPress={() => handleWarningPress(exercise.warning)}>
                                                    <IconComponent Icon={warningcircle} color="rgba(255, 6, 6, 0)" size={25} />
                                                </TouchableOpacity>
                                            </>
                                        ) : (
                                            <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
                                        )}
                                    </View>
                                    <View style={styles.exerciseDetails}>
                                        <Text style={styles.exerciseText}>Weight: {exercise.weight}kg</Text>
                                        <Text style={styles.exerciseText}>Sets: {exercise.sets}</Text>
                                        <Text style={styles.exerciseText}>Reps: {exercise.reps}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View style={styles.restDayContainer}>
                            <IconComponent Icon={emojisleep} color="rgba(0, 0, 0, 0.3)" size={40} style={{ marginBottom: 10 }} />
                            <Text style={styles.restDayText}>No Workout</Text>
                        </View>  
                    )}
                </View>
            </View>
            </ScrollView>

            {/* Warning Modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Warning</Text>
                        <Text style={styles.modalText}>{selectedWarning}</Text>
                        <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: '#fff',
    },
    textRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },
    workoutSection: {
        marginTop: 20,
    },
    workoutTitle: {
        fontSize: 16,
        backgroundColor: '#F4F4F5',
        padding: 10,
        borderRadius: 10,
        marginLeft: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 6,
    },
    sectionSubtitle: {
        fontSize: 15,
    },
    cycleMessageSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#F17CBB',
        borderRadius: 15,
    },
    cycleMessageText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    divider: {
        height: 0.6,
        backgroundColor: '#ddd',
        marginTop: 20,
    },
    exerciseContainer: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#F4F4F5',
        borderRadius: 15,
    },
    exerciseTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    exerciseName: {
        fontSize: 15,
        fontWeight: 600,
    },
    exerciseDetails: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    exerciseText: {
        fontSize: 14,
        color: '#000',
        marginRight: 18,
    },
    exerciseDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    restDayContainer: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restDayText: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.27)',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    warningContainer: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        gap: 15,
        alignSelf: 'stretch',
        borderRadius: 10,
        borderColor: 'rgba(255, 6, 6, 0.31)',
        borderWidth: 0.4,
        backgroundColor: 'rgba(254, 0, 0, 0.26)',
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        fontWeight: 300,
        color: '#660000',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#F17CBB',
    },
    modalText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#F17CBB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
});

export default HomeScreen;