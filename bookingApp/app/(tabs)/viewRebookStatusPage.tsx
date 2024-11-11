import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useViewRebookStatus } from '@/hooks/useViewRebookStatus';

const ViewRebookStatusPage: React.FC = () => {
    const [appointmentId, setAppointmentId] = useState<string>('');
    const { checkServiceStatus, statusMessage, loading, error } = useViewRebookStatus();

    const handleCheckStatus = () => {
        if (appointmentId) {
            checkServiceStatus(appointmentId);
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
            />
            <Button title={loading ? 'Checking...' : 'Check Status'} onPress={handleCheckStatus} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {statusMessage && <Text style={styles.statusMessage}>{statusMessage}</Text>}
        </View>
    );
};

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
    statusMessage: {
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
    },
});

export default ViewRebookStatusPage;