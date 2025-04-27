import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Button from '../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Define this in AppNavigator.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Logging in with:', email, password);

    try {
      const response = await fetch('https://cyclesync-backend-production.up.railway.app/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        console.log('Token:', data.access); 
        await AsyncStorage.setItem('accessToken', data.access); // Store the access token in AsyncStorage
        await AsyncStorage.setItem('refreshToken', data.refresh); // Store the refresh token in AsyncStorage
        navigation.navigate('Main'); // Navigate to the main screen after successful login
      } else {
        console.log('login failed:', data.error || 'Unknown error');
        Alert.alert('Login Failed', data.error || 'Unknown error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An error occurred while trying to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      {/* Login Button and SignUp Link */}
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.linkLabel}>Don't have an account?<Text style={styles.link} onPress={() => navigation.navigate('SignUp')}> Sign Up</Text></Text>
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

export default LoginScreen;