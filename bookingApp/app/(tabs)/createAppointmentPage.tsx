import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';

export default function CreateAppointmentPage() {
    const [serviceId, setServiceId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const { createAppointment, loading, error } = useCreateAppointment();

    const handleCreateAppointment = async () => {
        const { data, error } = await createAppointment(parseInt(serviceId), userId, startTime);
        if (data) {
            alert('Appointment created successfully');
        } else {
            alert(`Error: ${error}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Service ID</Text>
            <TextInput
                style={styles.input}
                value={serviceId}
                onChangeText={setServiceId}
                placeholder="Enter Service ID"
                keyboardType="numeric"
            />

            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
            />

            <Text style={styles.label}>Start Time</Text>
            <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="Enter Start Time (YYYY-MM-DD HH:MM:SS)"
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Create Appointment" onPress={handleCreateAppointment} />
            )}

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