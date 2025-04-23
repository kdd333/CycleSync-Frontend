import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SvgProps } from 'react-native-svg';
import emojisleep from '../assets/icons/emojisleep.svg';
import warningcircle from '../assets/icons/warningcircle.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [currentPhase, setCurrentPhase] = useState<string>('');
    const [cycleDay, setCycleDay] = useState<string>('');
    const [dailyMessage, setDailyMessage] = useState<string>('');
    const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
    const [workoutDetails, setWorkoutDetails] = useState<Workout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCycleData();
        fetchWorkoutLog();
    }, []);

    const fetchCycleData = async () => { 
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch('http://192.168.1.182:8000/api/cycle-data/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentPhase(data.current_phase || ""); 
                setCycleDay(data.cycle_day || "");
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

            const response = await fetch('http://192.168.1.182:8000/api/workout-logs/', {
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
                    fetchWorkoutDetails(todayLog.workout);
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
            const response = await fetch(`http://192.168.1.182:8000/api/workouts/${workoutId}/`, {
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
        await fetchCycleData();
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
                <View>
                    <View style={styles.textRow}> 
                        <Text style={styles.sectionTitle}>Current Phase:</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{currentPhase}</Text>
                        </View>
                    </View>
                    <View style={styles.textRow}>
                        <Text style={styles.sectionTitle}>Cycle Day:</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cycleDay}</Text>
                        </View>
                    </View>
                </View>

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
                                <Text style={styles.sectionSubtitle}>{workoutDetails.name}</Text>
                            </>
                        ) : (
                            <Text style={styles.sectionTitle}>Today's Workout:</Text>
                        )}

                    </View>

                    {isLoading ? (
                        <Text>Loading...</Text>
                    ) : workoutDetails ? (
                        <>
                            {workoutDetails.workout_exercises.map((exercise, index) => (
                                <View key={index} style={styles.exerciseContainer}>
                                    <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
                                    <View style={styles.exerciseDetails}>
                                        <Text style={styles.exerciseText}>Weight: {exercise.weight}kg</Text>
                                        <Text style={styles.exerciseText}>Sets: {exercise.sets}</Text>
                                        <Text style={styles.exerciseText}>Reps: {exercise.reps}</Text>
                                    </View>
                                    {exercise.warning ? (
                                        <View style={styles.warningContainer}>
                                            <IconComponent Icon={warningcircle} color="rgba(255, 6, 6, 0.31)" size={20} />
                                            <Text style={styles.warningText}>{exercise.warning}</Text>
                                        </View>
                                    ) : null}
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
    badge: {
        backgroundColor: '#EFF0F1', // Pink background for the badge
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5, 
    },
    badgeText: {
        color: '#000', 
        fontSize: 14,
    },
    workoutSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 6,
    },
    sectionSubtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 0,
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
        backgroundColor: '#EFF0F1',
        borderRadius: 15,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
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
});

export default HomeScreen;