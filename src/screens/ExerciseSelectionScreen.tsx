import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ArrowLeftIcon from '../assets/icons/arrowleft.svg';
import TickIcon from '../assets/icons/tick.svg';
import SearchIcon from '../assets/icons/search.svg';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

type ExerciseSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExerciseSelection'>;
type ExerciseSelectionScreenRouteProp = RouteProp<RootStackParamList, 'ExerciseSelection'>;

type ExerciseType = {
  id: string;
  name: string;
};

const ExerciseSelectionScreen = () => {
  const navigation = useNavigation<ExerciseSelectionScreenNavigationProp>();
  const route = useRoute<ExerciseSelectionScreenRouteProp>();
  const [selectedExercise, setSelectedExercise] = useState<{ id: string; name: string; exercise_type: ExerciseType } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [exercisesList, setExercisesList] = useState<{ id: string; name: string; exercise_type: ExerciseType }[]>([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/exercises/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExercisesList(data); // Assuming the API returns an array of exercise names
      } else {
        console.log('Failed to fetch exercises:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // Filtered exercises based on search
  const filteredExercises = exercisesList.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
        {/* Back Button & SearchBar */}
        <View style={styles.topContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeftIcon width={30} height={30} />
            </TouchableOpacity>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search Exercise"
                    placeholderTextColor="#A0A0A0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <SearchIcon width={20} height={20} />
            </View>
            
        </View>

        {/* List of Exercises */}
        <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            style={styles.exerciseList}
            renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => setSelectedExercise(item)}
                style={styles.exerciseItem}
              >
                <Text style={[styles.exerciseText, selectedExercise === item && styles.selectedText]}>
                    {item.name}
                </Text>
                {selectedExercise === item && <TickIcon width={20} height={20} />}
            </TouchableOpacity>
            )}
        />

        {/* Bottom Container with Add Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Select"
          onPress={() => {
            if (selectedExercise) {
              route.params.onSelectExercise(selectedExercise);
              navigation.goBack();
            }
          }}
        />
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
        marginTop: 40,
        marginBottom: 20,    
    }, 
    searchBarContainer: {
        width: '100%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    searchBar: {
        width: '90%',
        fontSize: 16,
    },
    exerciseList: {
        flex: 1,
    },
    exerciseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    exerciseText: {
        fontSize: 16,
        color: '#333',
    },
    selectedText: {
        color: '#F17CBB',
        fontWeight: 'bold',
    },
    bottomContainer: {
        backgroundColor: 'white',
    },
});

export default ExerciseSelectionScreen;
