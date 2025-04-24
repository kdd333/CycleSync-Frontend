import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularTimer from './CircularTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CycleOverviewContainerProps = {
    refreshTrigger: boolean;
};

const CycleOverviewContainer: React.FC<CycleOverviewContainerProps> = ({refreshTrigger}) => {
    const [cycleDay, setCycleDay] = React.useState<string>('');
    const [currentPhase, setCurrentPhase] = React.useState<string>('');
    const [cycleLength, setCycleLength] = React.useState<string>('');

    useEffect(() => {
        fetchCycleData();
    }, [refreshTrigger]);

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
                setCurrentPhase(data.current_phase || ''); // Set current phase
                setCycleDay(data.cycle_day || ''); // Set cycle day
                setCycleLength(data.cycle_length || ''); // Set cycle length, default to 28 if not provided
            } else {
                console.log('Failed to fetch cycle data:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching cycle data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.currentPhaseSection}>
                <View style={styles.textRow}>
                    <Text style={styles.title}>Menstrual Cycle Overview: </Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.subtitle}>Current Phase: </Text>
                    <View style={styles.currentPhaseContainer}>
                        <Text style={styles.phaseText}>{currentPhase}</Text>
                    </View>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.subtitle}>Cycle Length (Days): </Text>
                    <Text style={styles.phaseText}>{cycleLength}</Text>
                </View>
            </View>
            <CircularTimer cycleDay={parseInt(cycleDay) || 0} cycleLength={parseInt(cycleLength)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F4F4F5',
        borderRadius: 15,
    },
    currentPhaseSection: {
        //alignItems: 'center',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    currentPhaseContainer: {
        backgroundColor: '#F4F4F5',
        padding: 0,
        borderRadius: 10,
        marginLeft: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 200,
        marginRight: 5,
    },
    phaseText: {
        fontSize: 16,
        fontWeight: 400,
    },
});

export default CycleOverviewContainer;