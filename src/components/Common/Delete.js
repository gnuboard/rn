import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const ImageWithDeleteButton = ({ imageUri, onDelete }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 50,
    height: 50,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
  },
});