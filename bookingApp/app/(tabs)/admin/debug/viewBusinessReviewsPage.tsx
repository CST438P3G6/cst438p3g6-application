import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Button } from 'react-native';
import { useViewBusinessReviews } from '@/hooks/useViewBusinessReviews';

export default function ViewBusinessReviewsPage() {
    const [businessId, setBusinessId] = useState<string>('');
    const { reviews, loading, error } = useViewBusinessReviews(businessId);



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Business Reviews</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
            />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewBody}>{item.body}</Text>
                        <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
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
    reviewItem: {
        marginBottom: 15,
        padding: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    reviewBody: {
        fontSize: 16,
        marginBottom: 5,
    },
    reviewRating: {
        fontSize: 14,
        color: '#555',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});