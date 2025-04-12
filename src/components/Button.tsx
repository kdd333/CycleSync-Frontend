import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  size?: 'small' | 'large';
};

const Button = ({ title, onPress, size = 'large' }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, size === 'small' ? styles.smallButton : styles.largeButton]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F17CBB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  largeButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;