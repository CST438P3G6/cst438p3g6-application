import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useViewBusinessImages } from '@/hooks/useViewBusinessImages';

export default function ViewBusinessImagesPage() {
    const [businessId, setBusinessId] = useState<string>('');
    const { images, loading, error } = useViewBusinessImages(businessId);

    const handleFetchImages = () => {
        if (!businessId) {
            Alert.alert('Error', 'Please enter a business ID.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>View Business Images</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
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