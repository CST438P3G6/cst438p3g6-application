import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useDeleteReview } from '@/hooks/useDeleteReview';

export default function DeleteReviewPage() {
    const [reviewId, setReviewId] = useState<string>('');
    const { deleteReview, loading, error } = useDeleteReview();

    const handleDeleteReview = () => {
        if (reviewId) {
            deleteReview(reviewId);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delete Review</Text>
            <TextInput
                style={styles.input}
                value={reviewId}
                onChangeText={setReviewId}
                placeholder="Enter Review ID"
            />
            <Button title="Delete Review" onPress={handleDeleteReview} />
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