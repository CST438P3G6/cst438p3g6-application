import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useCancelAppointment } from '@/hooks/useCancelAppointment';

export default function CancelAppointmentPage() {
    const [appointmentId, setAppointmentId] = useState<string>('');
    const { cancelAppointment, loading, error } = useCancelAppointment();

    const handleCancel = () => {
        if (appointmentId) {
            cancelAppointment(Number(appointmentId));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Appointment ID</Text>
            <TextInput
                style={styles.input}
                value={appointmentId}
                onChangeText={setAppointmentId}
                placeholder="Enter Appointment ID"
                keyboardType="numeric"
            />
            <Button title="Cancel Appointment" onPress={handleCancel} />

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