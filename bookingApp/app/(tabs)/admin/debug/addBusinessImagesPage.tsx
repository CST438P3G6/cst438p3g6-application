import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput, Image, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAddBusinessImages } from '@/hooks/useAddBusinessImages';

export default function AddBusinessImagesPage() {
    const [images, setImages] = useState<string[]>([]);
    const [businessId, setBusinessId] = useState<string>('');
    const { uploadImages, loading, error } = useAddBusinessImages();

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets.map(asset => asset.uri));
        }
    };

    const handleUpload = async () => {
        if (images.length === 0 || !businessId) {
            Alert.alert('Error', 'Please select images and enter a business ID.');
            return;
        }

        try {
            let files;
            if (Platform.OS === 'web') {
                files = await Promise.all(images.map(async (image, index) => {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    return new File([blob], `business_${businessId}_${Date.now()}_${index}.jpg`, { type: 'image/jpeg' });
                }));
            } else {
                files = images.map((image, index) => ({
                    uri: image,
                    name: `business_${businessId}_${Date.now()}_${index}.jpg`,
                    type: 'image/jpeg',
                }));
            }

            const result = await uploadImages(files, parseInt(businessId));

            if (result.error) {
                Alert.alert('Error uploading images', result.error);
            } else {
                Alert.alert('Success', 'Images uploaded successfully');
                setImages([]);
                setBusinessId('');
            }
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            Alert.alert('Upload failed', 'An error occurred while uploading the images.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Business Images</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
                keyboardType="numeric"
            />
            <Button title="Pick images from camera roll" onPress={pickImages} />
            <ScrollView horizontal style={styles.imagePreview}>
                {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <Text>Image {index + 1}</Text>
                    </View>
                ))}
            </ScrollView>
            <Button title="Upload Images" onPress={handleUpload} disabled={loading} />
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
    imagePreview: {
        marginVertical: 15,
    },
    imageContainer: {
        alignItems: 'center',
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 75,
        marginBottom: 5,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});