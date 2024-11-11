import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useDeleteBusinessImage } from '@/hooks/useDeleteBusinessImage';

export default function DeleteBusinessImagePage() {
    const [imageId, setImageId] = useState<string>('');
    const { deleteImage, loading, error } = useDeleteBusinessImage();

    const handleDeleteImage = async () => {
        if (!imageId) {
            Alert.alert('Error', 'Please enter an image ID.');
            return;
        }

        const result = await deleteImage(parseInt(imageId));

        if (result.error) {
            Alert.alert('Error deleting image', result.error);
        } else {
            Alert.alert('Image deleted successfully');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delete Business Image</Text>
            <TextInput
                style={styles.input}
                value={imageId}
                onChangeText={setImageId}
                placeholder="Enter Image ID"
                keyboardType="numeric"
            />
            <Button title="Delete Image" onPress={handleDeleteImage} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});