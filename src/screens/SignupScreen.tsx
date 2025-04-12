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

  const handleSignUp = async () => {
    console.log('Signing up with:', name, email, password);
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('http://192.168.1.182:8000/api/signup/', {
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

      <Button title="Sign Up" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
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
      link: {
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 15,
      },
});

export default SignupScreen;