import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Image, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import EditIcon from '../assets/icons/edit.svg'; 
import LogoutIcon from '../assets/icons/logout.svg';
import KeyIcon from '../assets/icons/key.svg';
import MoonIcon from '../assets/icons/moon.svg';
import ScrollIcon from '../assets/icons/scroll.svg';
import RightArrowIcon from '../assets/icons/rightarrow.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; 
import { API_BASE_URL } from '../config';

type ProfileScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [menstrualLength, setMenstrualLength] = useState<number>(5);
    const [follicularLength, setFollicularLength] = useState<number>(10);
    const [ovulationLength, setOvulationLength] = useState<number>(1);
    const [lutealLength, setLutealLength] = useState<number>(12);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        // Fetch user details from the backend API
        try {
            setLoading(true); 
            const accessToken = await AsyncStorage.getItem('accessToken'); // Get the access token from AsyncStorage
            if (!accessToken) {
                console.log('No access token found');
                Alert.alert('Error', 'No access token found. Please log in again.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/user/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
                },
            });

            if (response.ok) {
                const data = await response.json();
                setName(data.name);   
                setEmail(data.email);
                setMenstrualLength(data.menstrual_length);
                setFollicularLength(data.follicular_length);
                setOvulationLength(data.ovulation_length);
                setLutealLength(data.luteal_length);
            } else {
                console.log('Failed to fetch user details:', response.statusText);
                Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
            }

        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
        } finally {
            setLoading(false); 
        }
    };

    const onRefresh = async () => {
        // Handle pull-to-refresh
        setRefreshing(true); 
        await fetchUserDetails(); 
        setRefreshing(false); 
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

            const response = await fetch(`${API_BASE_URL}/api/user/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    menstrual_length: menstrualLength,
                    follicular_length: follicularLength,
                    ovulation_length: ovulationLength,
                    luteal_length: lutealLength,
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
                const response = await fetch(`${API_BASE_URL}/api/logout/`, {
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
                    {isEditing ? (
                        <TouchableOpacity style={styles.editIcon}>
                            <EditIcon width={20} height={20} fill="#F17CBB" />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </View>
                {isEditing ? (
                    <>
                        <View style={styles.editDetailsSection}>
                            <View style={styles.editDetailsRow}>
                                <Text>Name:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder='Name'
                                />
                            </View>
                            <View style={styles.editDetailsRow}>
                                <Text>Email:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder='Email Address'
                                />
                            </View>
                        </View>

                        <View style={styles.editPhasesSection}>
                            {/* Edit Cycle Lengths Section */}
                            <Text style={styles.sectionTitle}>My Menstrual Cycle Lengths:</Text>
                            <View style={styles.phaseLengthContainer}>
                                <Text style={styles.sectionSubTitle}>Menstrual Phase:</Text>
                                <TextInput
                                    style={styles.phaseLengthInput}
                                    value={menstrualLength.toString()}
                                    onChangeText={(text) => setMenstrualLength(Number(text))}
                                    keyboardType="numeric"
                                    placeholder="Period Length"
                                />
                            </View>
                            <View style={styles.phaseLengthContainer}>
                                <Text style={styles.sectionSubTitle}>Follicular Phase:</Text>
                                <TextInput
                                    style={styles.phaseLengthInput}
                                    value={follicularLength.toString()}
                                    onChangeText={(text) => setFollicularLength(Number(text))}
                                    keyboardType="numeric"
                                    placeholder="Follicular Length"
                                />
                            </View>
                            <View style={styles.phaseLengthContainer}>
                                <Text style={styles.sectionSubTitle}>Ovulation Phase:</Text>
                                <TextInput
                                    style={styles.phaseLengthInput}
                                    value={ovulationLength.toString()}
                                    onChangeText={(text) => setOvulationLength(Number(text))}
                                    keyboardType="numeric"
                                    placeholder="Ovulation Length"
                                />
                            </View>
                            <View style={styles.phaseLengthContainer}>
                                <Text style={styles.sectionSubTitle}>Luteal Phase:</Text>
                                <TextInput
                                    style={styles.phaseLengthInput}
                                    value={lutealLength.toString()}
                                    onChangeText={(text) => setLutealLength(Number(text))}
                                    keyboardType="numeric"
                                    placeholder="Luteal Length"
                                />
                            </View>
                        </View>
                    </>
                ) : (
                    <>  
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#F17CBB" />
                            </View>
                        ) : (
                            <>
                                <Text style={styles.name}>{name}</Text>
                                <Text style={styles.email}>{email}</Text>
                            </>
                        )}
                    </>
                )}

                {loading ? (
                    <></>
                ) : (
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
                )}
                {isEditing && (
                    <Text style={styles.link} onPress={() => setIsEditing(false)}>Cancel</Text>
                )}
            </View>
            
            {/* Settings Section */}
            {isEditing ? (
                <>
                {/* Hide this section if in edit mode */}
                </>
                
            ) : (
                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingRow}>
                        <MoonIcon width={20} height={20} />
                        <Text style={styles.settingText}>Dark Mode</Text>
                        <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <KeyIcon width={20} height={20} />
                        <Text style={styles.settingText}>Change Password</Text>
                        <RightArrowIcon width={20} height={20} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.settingRow}
                        onPress={() => navigation.navigate('TermsAndConditions')}
                    >
                        <ScrollIcon width={20} height={20} />
                        <Text style={styles.settingText}>Terms & Conditions</Text>
                        <RightArrowIcon width={20} height={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
                        <LogoutIcon width={20} height={20} />
                        <Text style={styles.settingText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        alignItems: 'center',
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
    link: {
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 15,
    },
    editDetailsSection: {
        marginTop: 15,
        width: '100%',
    },
    editDetailsRow: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
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
        marginLeft: 'auto',
        width: '85%',
        padding: 6,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    sectionSubTitle: {
        alignSelf: 'center',
        fontSize: 12,
    },
    editPhasesSection: {
        width: '100%',
        marginVertical: 10,
    },
    phaseLengthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    phaseLengthInput: {
        padding: 6,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '50%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
    },
});

export default ProfileScreen;