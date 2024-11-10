import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useViewService } from '@/hooks/useViewService';
import { useEditService } from '@/hooks/useEditService';

export default function EditServicePage() {
    const [serviceId, setServiceId] = useState<number | null>(null);
    const { service, loading: viewLoading, error: viewError } = useViewService(serviceId ?? 0);
    const { editService, loading: editLoading, error: editError } = useEditService();
    const [serviceData, setServiceData] = useState(service);

    useEffect(() => {
        if (service) {
            setServiceData(service);
        }
    }, [service]);

    const handleFetchService = () => {
        if (!serviceId) {
            Alert.alert('Please enter a valid service ID');
        }
    };

    const handleSave = async () => {
        if (serviceData) {
            const result = await editService(serviceData);
            if (result.error) {
                Alert.alert('Error updating service', result.error);
            } else {
                Alert.alert('Service updated successfully');
            }
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
            <Button title="Fetch Service" onPress={handleFetchService} disabled={viewLoading} />
            {viewLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            {viewError && <Text style={styles.errorText}>{viewError}</Text>}
            {serviceData && (
                <>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={serviceData.name}
                        onChangeText={(text) => setServiceData({ ...serviceData, name: text })}
                    />
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={serviceData.description}
                        onChangeText={(text) => setServiceData({ ...serviceData, description: text })}
                    />
                    <Text style={styles.label}>Cost</Text>
                    <TextInput
                        style={styles.input}
                        value={serviceData.cost.toString()}
                        onChangeText={(text) => setServiceData({ ...serviceData, cost: parseFloat(text) })}
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Time Needed</Text>
                    <TextInput
                        style={styles.input}
                        value={serviceData.time_needed}
                        onChangeText={(text) => setServiceData({ ...serviceData, time_needed: text })}
                    />
                    <Text style={styles.label}>Active</Text>
                    <TextInput
                        style={styles.input}
                        value={serviceData.is_active ? 'Yes' : 'No'}
                        onChangeText={(text) => setServiceData({ ...serviceData, is_active: text.toLowerCase() === 'yes' })}
                    />
                    <Button title="Save" onPress={handleSave} disabled={editLoading} />
                </>
            )}
            {editError && <Text style={styles.errorText}>{editError}</Text>}
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