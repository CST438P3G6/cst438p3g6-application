import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useViewService } from '@/hooks/useViewService';

export default function ViewServicePage() {
    const [serviceId, setServiceId] = useState<number | null>(null);
    const { service, loading, error } = useViewService(serviceId ?? 0);

    const handleFetchService = () => {
        if (!serviceId) {
            Alert.alert('Please enter a valid service ID');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Service ID</Text>
            <TextInput
                style={styles.input}
                value={serviceId ? serviceId.toString() : ''}
                onChangeText={(text) => setServiceId(parseInt(text))}
                placeholder="Enter Service ID"
                keyboardType="numeric"
            />
            <Button title="Fetch Service" onPress={handleFetchService} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {service && (
                <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text>{service.description}</Text>
                    <Text>Cost: ${service.cost}</Text>
                    <Text>Time Needed: {service.time_needed}</Text>
                    <Text>Active: {service.is_active ? 'Yes' : 'No'}</Text>
                </View>
            )}
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
    serviceDetails: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});