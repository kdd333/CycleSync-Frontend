import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularTimerProps {
    cycleDay: number;
    cycleLength: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ cycleDay, cycleLength }) => {
    const radius = 50; // Radius of the circle
    const strokeWidth = 10; // Thickness of the circle
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = cycleDay / cycleLength; // Calculate progress as a fraction
    const strokeDashoffset = circumference * (1 - progress); // Calculate the offset for the progress

    return (
        <View style={styles.container}>
            <Svg height={radius * 2} width={radius * 2} style={{ transform: [{ rotate: '-90deg' }] }}>
                {/* Background Circle */}
                <Circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke="#ddd"
                strokeWidth={strokeWidth}
                fill="none"
                />
                {/* Progress Circle */}
                <Circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke="#F17CBB"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={styles.labelText}>Day</Text>
                <Text style={styles.dayText}>{cycleDay}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F17CBB',
    },
    labelText: {
        fontSize: 14,
        color: '#999',
    },
});

export default CircularTimer;