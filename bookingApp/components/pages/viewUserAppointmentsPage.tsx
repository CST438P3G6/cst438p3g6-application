import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useViewUserAppointments } from '@/hooks/useViewUserAppointments';

export default function ViewUserAppointmentsPage() {
    const [userId, setUserId] = useState<string>('');
    const { appointments, loading, error } = useViewUserAppointments(userId);

    // @ts-ignore
    const renderAppointment = ({ item }) => (
        <View style={styles.appointment}>
            <Text>Service ID: {item.service_id}</Text>
            <Text>Start Time: {item.start_time}</Text>
            <Text>End Time: {item.end_time}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Cost: {item.cost}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
            />
            <Button title="Fetch Appointments" onPress={() => {}} />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={appointments}
                renderItem={renderAppointment}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
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
    list: {
        marginTop: 20,
    },
    appointment: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});