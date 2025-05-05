import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../assets/icons/arrowleft.svg';

const TermsAndConditionsScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'TermsAndConditions'>>();

    return (
        <View style={styles.container}>
            {/* Back Button & Title */}
            <ArrowLeftIcon width={30} height={30} onPress={() => navigation.goBack()} />
            <View style={styles.topContainer}>
                <Text style={styles.title}>TERMS & CONDITIONS</Text>
                <Text>v1.0.0</Text>
            </View>
            {/* Terms and Conditions Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.content}>
                Welcome to CycleSync! By using this app, you agree to the following terms and conditions:
                </Text>
                <Text style={styles.sectionTitle}>1. General Use</Text>
                <Text style={styles.content}>
                This app is designed for informational purposes only. It is not a substitute for professional medical advice.
                </Text>
                <Text style={styles.sectionTitle}>2. Privacy</Text>
                <Text style={styles.content}>
                Your data is stored securely and will not be shared with third parties without your consent.
                </Text>
                <Text style={styles.sectionTitle}>3. User Responsibility</Text>
                <Text style={styles.content}>
                You are responsible for ensuring the accuracy of the data you input into the app.
                </Text>
                <Text style={styles.sectionTitle}>4. Changes to Terms</Text>
                <Text style={styles.content}>
                We reserve the right to update these terms and conditions at any time. Please review them periodically.
                </Text>
                <Text style={styles.content}>
                Thank you for using CycleSync!
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 70,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#F17CBB',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
        marginBottom: 10,
    },
});

export default TermsAndConditionsScreen;