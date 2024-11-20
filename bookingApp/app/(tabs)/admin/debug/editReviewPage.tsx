import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useEditReview } from '@/hooks/useEditReview';

export default function EditReviewPage() {
    const [reviewId, setReviewId] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const { editReview, loading, error } = useEditReview();

    const handleEditReview = () => {
        if (reviewId && body && rating) {
            editReview(reviewId, { body, rating });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Review</Text>
            <TextInput
                style={styles.input}
                value={reviewId}
                onChangeText={setReviewId}
                placeholder="Enter Review ID"
            />
            <TextInput
                style={styles.input}
                value={body}
                onChangeText={setBody}
                placeholder="Enter Review Body"
            />
            <TextInput
                style={styles.input}
                value={rating.toString()}
                onChangeText={(text) => setRating(Number(text))}
                placeholder="Enter Rating"
                keyboardType="numeric"
            />
            <Button title="Edit Review" onPress={handleEditReview} />
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