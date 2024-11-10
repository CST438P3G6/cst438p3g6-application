import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useCreateService } from '@/hooks/useCreateService';

type Service = {
    id?: number;
    business_id: number;
    name: string;
    description?: string;
    cost: number;
    time_needed: string; // Use string to represent interval
    is_active?: boolean;
};

export default function CreateServicePage() {
    const { createService, loading, error } = useCreateService();
    const [service, setService] = useState<Omit<Service, 'id'>>({
        business_id: 0,
        name: '',
        description: '',
        cost: 0,
        time_needed: '00:00:00', // Default interval format
        is_active: true
    });

    const handleCreate = async () => {
        const result = await createService(service);

        if (result.error) {
            Alert.alert('Error creating service', result.error);
        } else {
            Alert.alert('Service created successfully');
            console.log('Service created:', service); // Placeholder action for testing
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={service.name}
                onChangeText={(text) => setService({ ...service, name: text })}
                placeholder="Enter service name"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                value={service.description}
                onChangeText={(text) => setService({ ...service, description: text })}
                placeholder="Enter service description"
            />
            <Text style={styles.label}>Cost</Text>
            <TextInput
                style={styles.input}
                value={service.cost.toString()}
                onChangeText={(text) => setService({ ...service, cost: parseFloat(text) })}
                placeholder="Enter service cost"
                keyboardType="numeric"
            />
            <Text style={styles.label}>Time Needed</Text>
            <TextInput
                style={styles.input}
                value={service.time_needed}
                onChangeText={(text) => setService({ ...service, time_needed: text })}
                placeholder="Enter time needed (HH:MM:SS)"
            />
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={service.business_id.toString()}
                onChangeText={(text) => setService({ ...service, business_id: parseInt(text) })}
                placeholder="Enter business ID"
                keyboardType="numeric"
            />
            <Button title="Create Service" onPress={handleCreate} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
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
    loader: {
        marginVertical: 20,
    },
});