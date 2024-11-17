import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAddReviewImages } from '@/hooks/useAddReviewImages';
import { Button } from '@/components/ui/button';

export default function AddReviewImagesPage() {
    const [images, setImages] = useState<string[]>([]);
    const [reviewId, setReviewId] = useState<string>('');
    const { uploadImages, loading, error } = useAddReviewImages();

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
        if (images.length === 0 || !reviewId) {
            Alert.alert('Error', 'Please select images and enter a review ID.');
            return;
        }

        try {
            const files = await Promise.all(images.map(async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                return new File([blob], `review_${reviewId}_${Date.now()}.jpg`, { type: 'image/jpeg' });
            }));

            const result = await uploadImages(files, parseInt(reviewId));

            if (result.error) {
                Alert.alert('Error uploading images', result.error);
            } else {
                Alert.alert('Success', 'Images uploaded successfully');
                setImages([]);
                setReviewId('');
            }
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            Alert.alert('Upload failed', 'An error occurred while uploading the images.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Review Images</Text>
            <TextInput
                style={styles.input}
                value={reviewId}
                onChangeText={setReviewId}
                placeholder="Enter Review ID"
                keyboardType="numeric"
            />
            <Button onPress={pickImages}>Pick images from camera roll</Button>            <ScrollView horizontal style={styles.imagePreview}>
                {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <Text>Image {index + 1}</Text>
                    </View>
                ))}
            </ScrollView>
            <Button onPress={handleUpload} disabled={loading} >Upload Images</Button>
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