import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useViewReviewImages } from '@/hooks/useViewReviewImages';

export default function ViewReviewImagesPage() {
    const [reviewId, setReviewId] = useState<string>('');
    const { images, loading, error } = useViewReviewImages(Number(reviewId));

    const handleFetchImages = () => {
        if (!reviewId) {
            Alert.alert('Error', 'Please enter a review ID.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>View Review Images</Text>
            <TextInput
                style={styles.input}
                value={reviewId}
                onChangeText={setReviewId}
                placeholder="Enter Review ID"
                keyboardType="numeric"
            />
            <Button title="Fetch Images" onPress={handleFetchImages} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={images}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="contain" />
                    </View>
                )}
            />
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
    imageContainer: {
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 200,
    },
});