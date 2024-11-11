import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Picker, FlatList } from 'react-native';
import { useViewAppointmentsByStatusAndParentId } from '@/hooks/useViewAppointmentsByStatusAndParentId';

const ViewAppointmentsByStatusPage: React.FC = () => {
    const [status, setStatus] = useState<string>('pending');
    const [id, setId] = useState<string>('');
    const [parentTable, setParentTable] = useState<'user_id' | 'service_id' | 'business_id'>('user_id');
    const { fetchAppointments, appointments, loading, error } = useViewAppointmentsByStatusAndParentId();

    const handleFetchAppointments = () => {
        if (status && id && parentTable) {
            fetchAppointments(status, id, parentTable);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Status</Text>
            <TextInput
                style={styles.input}
                value={status}
                onChangeText={setStatus}
                placeholder="Enter Status"
            />
            <Text style={styles.label}>ID</Text>
            <TextInput
                style={styles.input}
                value={id}
                onChangeText={setId}
                placeholder="Enter ID"
            />
            <Text style={styles.label}>Parent Table</Text>
            <Picker
                selectedValue={parentTable}
                style={styles.input}
                onValueChange={(itemValue) => setParentTable(itemValue)}
            >
                <Picker.Item label="User ID" value="user_id" />
                <Picker.Item label="Service ID" value="service_id" />
                <Picker.Item label="Business ID" value="business_id" />
            </Picker>
            <Button title={loading ? 'Fetching...' : 'Fetch Appointments'} onPress={handleFetchAppointments} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={appointments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.appointmentContainer}>
                        <Text>{JSON.stringify(item)}</Text>
                    </View>
                )}
            />
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
    appointmentContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ViewAppointmentsByStatusPage;