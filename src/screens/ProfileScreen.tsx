import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Image, Alert, RefreshControl } from 'react-native';
import EditIcon from '../assets/icons/edit.svg'; 
import LogoutIcon from '../assets/icons/logout.svg';
import KeyIcon from '../assets/icons/key.svg';
import MoonIcon from '../assets/icons/moon.svg';
import ScrollIcon from '../assets/icons/scroll.svg';
import RightArrowIcon from '../assets/icons/rightarrow.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; 

type ProfileScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('Khadijah Darragi');
    const [email, setEmail] = useState('khadijahdarragi@gmail.com');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { 
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        // Fetch user details from the backend API
        try {

            const accessToken = await AsyncStorage.getItem('accessToken'); // Get the access token from AsyncStorage
            if (!accessToken) {
                console.log('No access token found');
                Alert.alert('Error', 'No access token found. Please log in again.');
                return;
            }

            const response = await fetch('http://192.168.1.182:8000/api/user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
                },
            });

            if (response.ok) {
                const data = await response.json();
                setName(data.name);   // update name and email with fetched data
                setEmail(data.email);
            } else {
                console.log('Failed to fetch user details:', response.statusText);
                Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
            }

        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
        }
    };

    const onRefresh = async () => {
        // Handle pull-to-refresh
        setRefreshing(true); // Show the refresh indicator
        await fetchUserDetails(); // Fetch the latest user details
        setRefreshing(false); // Hide the refresh indicator
    };

    const handleSaveDetails = async () => {
        // Handle saving user details to the backend API
        try {
            const accessToken = await AsyncStorage.getItem('accessToken'); // Get the access token from AsyncStorage
            if (!accessToken) {
                console.log('No access token found');
                Alert.alert('Error', 'No access token found. Please log in again.');
                return;
            }

            const response = await fetch('http://192.168.1.182:8000/api/user/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User details updated:', data);
                Alert.alert('Success', 'Details updated successfully!');
                setIsEditing(false); // Exit edit mode after saving
            } else {
                console.log('Failed to update user details:', response.statusText);
                Alert.alert('Error', 'Failed to update user details. Please try again later.');
            }

        } catch (error) {
            console.error('Error updating user details:', error);
            Alert.alert('Error', 'An error occurred while updating user details. Please try again later.');
        }
    };

    const handleLogout = async () => {
        // Handle logout functionality for logout button
        try {
            // Get the refresh token and access token from AsyncStorage
            const refreshToken = await AsyncStorage.getItem('refreshToken'); 
            const accessToken = await AsyncStorage.getItem('accessToken'); 

            if (refreshToken) {
                // call backend logout API to blacklist the refresh token
                const response = await fetch('http://192.168.1.182:8000/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`, 
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                });

                if (!response.ok) {
                    console.log('failed to logout on the server:', response.statusText);
                    const errorData = await response.json();
                    console.log('Error data:', errorData || 'Unknown error');
                } else {
                    console.log('Logout successful on the server');
                }
            }

            // Clear tokens from AsyncStorage
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            // Navigate to login screen
            navigation.navigate('Login'); 
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'An error occurred while logging out. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={require('../assets/icons/user.svg')} // replace with profile image
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editIcon}>
                        <EditIcon width={20} height={20} fill="#F17CBB" />
                    </TouchableOpacity>
                </View>
                {isEditing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder='Name'
                        />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder='Email Address'
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </>
                )}

                <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => {
                        if (isEditing) {
                            handleSaveDetails(); // Save details when in edit mode
                            setIsEditing(false); // Exit edit mode
                        } else {
                            setIsEditing(true); // Enter edit mode
                        }
                    }} 
                >
                    {isEditing ? <RightArrowIcon width={25} height={25} /> : <EditIcon width={20} height={20} />}
                    <Text style={styles.editButtonText}> {isEditing ? "Save Details" : "Edit Details"} </Text>
                </TouchableOpacity>
            </View>
            
            {/* Settings Section */}
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingRow}>
                    <MoonIcon width={20} height={20} />
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow}>
                    <KeyIcon width={20} height={20} />
                    <Text style={styles.settingText}>Change Password</Text>
                    <RightArrowIcon width={20} height={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow}>
                    <ScrollIcon width={20} height={20} />
                    <Text style={styles.settingText}>Terms & Conditions</Text>
                    <RightArrowIcon width={20} height={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
                    <LogoutIcon width={20} height={20} />
                    <Text style={styles.settingText}>Logout</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#ddd',
    },
    editIcon: {
        position: 'absolute',
        bottom: 110,
        right: 5,
        backgroundColor: '#F17CBB',
        padding: 5,
        borderRadius: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    email: {
        fontSize: 14,
        color: 'gray',
    },
    input: {
        width: '100%',
        padding: 6,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 10,
    },
    editButton: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#F17CBB',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 10,
    },
    settingsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginTop: 20,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 16,
        flex: 1,
        marginLeft: 15,
    },
});

export default ProfileScreen;