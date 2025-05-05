import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; 
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../assets/icons/arrowleft.svg'; 


const HelpScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Help'>>();

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.topContainer}>
                <ArrowLeftIcon width={30} height={30} onPress={() => navigation.goBack()} />
            </View>
            <View style={styles.mainContainer}>
                <Text style={styles.title}>Help Screen</Text>
                <Text>(Coming Soon)</Text>
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
        marginTop: 40,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
});

export default HelpScreen;