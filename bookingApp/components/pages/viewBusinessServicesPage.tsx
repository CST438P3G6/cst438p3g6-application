import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useViewBusinessServices } from '@/hooks/useViewBusinessServices';

export default function ViewBusinessServicesPage() {
    const [businessId, setBusinessId] = useState<number | null>(null);
    const { services, loading, error } = useViewBusinessServices(businessId ?? 0);

    const handleFetchServices = () => {
        if (!businessId) {
            Alert.alert('Please enter a valid business ID');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId ? businessId.toString() : ''}
                onChangeText={(text) => setBusinessId(parseInt(text))}
                placeholder="Enter Business ID"
                keyboardType="numeric"
            />
            <Button title="Fetch Services" onPress={handleFetchServices} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={services}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.serviceItem}>
                        <Text style={styles.serviceName}>{item.name}</Text>
                        <Text>{item.description}</Text>
                        <Text>Cost: ${item.cost}</Text>
                        <Text>Time Needed: {item.time_needed}</Text>
                        <Text>Active: {item.is_active ? 'Yes' : 'No'}</Text>
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
    loader: {
        marginVertical: 20,
    },
    serviceItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});