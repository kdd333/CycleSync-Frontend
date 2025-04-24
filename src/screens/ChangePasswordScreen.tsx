import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ChangePasswordScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ChangePassword'>;
};

const ChangePasswordScreen = ({ navigation }: ChangePasswordScreenProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword === currentPassword) {
        Alert.alert("Error", "New password cannot be the same as current password.");
        return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
        Alert.alert("Error", "New password must be at least 8 characters long.");
        return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert("Error", "No access token found. Please log in again.");
        return;
      }

      const response = await fetch('http://192.168.1.182:8000/api/change-password/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Password changed successfully!");
        navigation.goBack(); // Navigate back to the ProfileScreen
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "An error occurred while changing the password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Change Password" onPress={handleChangePassword} />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  link: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default ChangePasswordScreen;