import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useUserFavorites } from '@/hooks/useUserFavorites';

export default function ViewUserFavoritesPage() {
    const [userId, setUserId] = useState<string>('');
    const { favorites, loading, error } = useUserFavorites(userId);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
            />
            <Button title="Fetch Favorites" onPress={() => {}} />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={favorites}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.favoriteContainer}>
                        <Text>Business ID: {item.business_id}</Text>
                        <Text>User ID: {item.user_id}</Text>
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
    favoriteContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});