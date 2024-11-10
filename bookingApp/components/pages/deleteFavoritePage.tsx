import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useDeleteFavorite } from '@/hooks/useDeleteFavorite';

export default function DeleteFavoritePage() {
    const [userId, setUserId] = useState<string>('');
    const [businessId, setBusinessId] = useState<number | null>(null);
    const { deleteFavorite, loading, error } = useDeleteFavorite();

    const handleDeleteFavorite = () => {
        if (userId && businessId) {
            deleteFavorite(userId, businessId);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
            />
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId ? businessId.toString() : ''}
                onChangeText={(text) => setBusinessId(Number(text))}
                keyboardType="numeric"
                placeholder="Enter Business ID"
            />
            <Button title="Delete Favorite" onPress={handleDeleteFavorite} />

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