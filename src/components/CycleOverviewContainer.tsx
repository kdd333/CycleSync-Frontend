import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularTimer from './CircularTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CycleOverviewContainerProps = {
    refreshTrigger: boolean;
};

const CycleOverviewContainer: React.FC<CycleOverviewContainerProps> = ({refreshTrigger}) => {
    const [cycleDay, setCycleDay] = React.useState<string>('0');
    const [currentPhase, setCurrentPhase] = React.useState<string>('Follicular Phase');

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
                <Text style={styles.title}>Current Phase: </Text>
                <View style={styles.currentPhaseContainer}>
                    <Text style={styles.phaseText}>{currentPhase}</Text>
                </View>
            </View>
            <CircularTimer cycleDay={parseInt(cycleDay) || 0} cycleLength={28} />
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
    },
    currentPhaseSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    currentPhaseContainer: {
        backgroundColor: '#F4F4F5',
        padding: 10,
        borderRadius: 10,
        marginLeft: 5,
    },
    title: {
        fontSize: 15,
    },
    phaseText: {
        fontSize: 16,
    },
});

export default CycleOverviewContainer;