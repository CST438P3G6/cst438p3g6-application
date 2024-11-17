import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';

export default function ViewAvailableAppointmentsPage() {
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [serviceDuration, setServiceDuration] = useState<number>(30);
    const [slotStartInterval, setSlotStartInterval] = useState<number>(30);

    const { availableTimeSlots, loading, error } = useAvailableTimeSlots(
        businessId!,
        startDate,
        endDate,
        serviceDuration,
        slotStartInterval
    );

    const handleFetchSlots = () => {
        if (businessId && startDate && endDate) {
            // Trigger the hook to fetch available time slots
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId ? businessId.toString() : ''}
                onChangeText={(text) => setBusinessId(Number(text))}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Start Date</Text>
            <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
            />
            <Text style={styles.label}>End Date</Text>
            <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
            />
            <Text style={styles.label}>Service Duration (minutes)</Text>
            <TextInput
                style={styles.input}
                value={serviceDuration.toString()}
                onChangeText={(text) => setServiceDuration(Number(text))}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Time between slots (minutes)</Text>
            <TextInput
                style={styles.input}
                value={slotStartInterval.toString()}
                onChangeText={(text) => setSlotStartInterval(Number(text))}
                keyboardType="numeric"
            />
            <Button title="Fetch Available Slots" onPress={handleFetchSlots} />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={availableTimeSlots}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.slotContainer}>
                        <Text>{item.day}</Text>
                        <Text>Start: {item.slot_start}</Text>
                        <Text>End: {item.slot_end}</Text>
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
    slotContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});