import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useCreateReview } from '@/hooks/useCreateReview';

export default function CreateReviewPage() {
    const [businessId, setBusinessId] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [rating, setRating] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const { createReview, loading, error } = useCreateReview();

    const handleCreateReview = () => {
        if (businessId && body && rating && userId) {
            createReview(Number(businessId), body, Number(rating), userId);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
                keyboardType="numeric"
            />
            <Text style={styles.label}>Review</Text>
            <TextInput
                style={styles.input}
                value={body}
                onChangeText={setBody}
                placeholder="Enter Review"
            />
            <Text style={styles.label}>Rating</Text>
            <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                placeholder="Enter Rating (1-5)"
                keyboardType="numeric"
            />
            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
            />
            <Button title="Submit Review" onPress={handleCreateReview} />

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
    label: {
        fontSize: 16,
        marginBottom: 5,
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