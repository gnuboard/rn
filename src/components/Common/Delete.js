import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Styles } from '../../styles/styles';

export const ImageWithDeleteButton = ({ imageUri, onDelete }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        accessible={true}
        accessibilityLabel={`이미지 ${imageUri} 삭제`}
        accessibilityRole="button"
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = new Styles.Delete();