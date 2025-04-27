import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Button from '../components/Button';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
};

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false); 

  const handleSignUp = async () => {
    if (!isChecked) {
      Alert.alert('You must accept the terms and conditions to proceed.');
      return;
    }

    console.log('Signing up with:', name, email, password);
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('https://cyclesync-backend-production.up.railway.app/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        console.log('signup successful:', data);
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login'); // Navigate to the login screen after successful signup
      } else {
        console.log('Signup failed:', data.error || 'Unknown error');
        Alert.alert('Signup Failed', data.error || 'Unknown error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Failed', 'An error occurred while trying to sign up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Checkbox for Terms and Conditions */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <Text style={styles.checkmark}>&#10003;</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>
          I agree to the{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('TermsAndConditions')}
          >
            Terms and Conditions
          </Text>
        </Text>
      </View>

      {/* Sign Up Button and Login Link*/}
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={styles.linkLabel}>Already have an account?<Text style={styles.link} onPress={() => navigation.navigate('Login')}> Login</Text></Text>
    </View>
  );
};

// Reuse the same styles as LoginScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
      },
      title: {
        fontSize: 28,
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
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      },
      checkmark: {
        color: '#fff',
        textAlign: 'center',
      },
      checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
      },
      checkboxChecked: {
        backgroundColor: '#F17CBB',
        borderColor: '#F17CBB',
      },
      checkboxLabel: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
      },
      linkLabel: {
        marginTop: 15,
        textAlign: 'center',
      },
      link: {
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 15,
      },
});

export default SignupScreen;