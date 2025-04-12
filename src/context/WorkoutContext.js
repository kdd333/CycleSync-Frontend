import React, { createContext, useState } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);

  const addWorkout = (name) => {
    setWorkouts([...workouts, { id: Date.now(), name }]);
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
