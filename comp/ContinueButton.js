import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ContinueButton = ({ onPress, isDisabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.continue, { backgroundColor: isDisabled ? '#9B9B9B' : 'white' }]}
      disabled={isDisabled}
    >
      <Text style={[styles.description, { margin: 15, color: isDisabled ? '#F5F5F5' : 'black' }]}>
        Continue
      </Text>
    </TouchableOpacity>
  );
};

export default ContinueButton;

const styles = StyleSheet.create({
  continue: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  description: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
