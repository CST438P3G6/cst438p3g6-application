import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useUpsertBusinessHours } from '@/hooks/useUpsertBusinessHours';
import { useViewBusinessHours } from '@/hooks/useViewBusinessHours';

type BusinessHour = {
    business_id: string;
    day: string;
    open_time: string;
    close_time: string;
};

export default function ModifyBusinessHoursPage() {
    const [businessId, setBusinessId] = useState<string>('');
    const { businessHours, loading: fetching, error } = useViewBusinessHours(businessId);
    const { upsertBusinessHours, loading: upsertLoading, error: upsertError } = useUpsertBusinessHours();
    const [newBusinessHour, setNewBusinessHour] = useState<BusinessHour>({
        business_id: '',
        day: '',
        open_time: '',
        close_time: '',
    });

    const handleSave = async () => {
        const result = await upsertBusinessHours(businessHours);

        if (result.error) {
            Alert.alert('Error updating business hours', result.error);
        } else {
            Alert.alert('Business hours updated successfully');
        }
    };

    const handleInputChange = (index: number, field: keyof BusinessHour, value: string) => {
        const updatedHours = [...businessHours];
        updatedHours[index][field] = value;
        upsertBusinessHours(updatedHours);
    };

    const handleAddBusinessHour = () => {
        const newHour = { ...newBusinessHour, business_id: businessId };
        upsertBusinessHours([...businessHours, newHour]);
        setNewBusinessHour({ business_id: '', day: '', open_time: '', close_time: '' });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
            />
            {fetching ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {businessHours.map((hour, index) => (
                        <View key={index} style={styles.hourContainer}>
                            <Text style={styles.label}>Day</Text>
                            <TextInput
                                style={styles.input}
                                value={hour.day}
                                onChangeText={(text) => handleInputChange(index, 'day', text)}
                            />
                            <Text style={styles.label}>Open Time</Text>
                            <TextInput
                                style={styles.input}
                                value={hour.open_time}
                                onChangeText={(text) => handleInputChange(index, 'open_time', text)}
                            />
                            <Text style={styles.label}>Close Time</Text>
                            <TextInput
                                style={styles.input}
                                value={hour.close_time}
                                onChangeText={(text) => handleInputChange(index, 'close_time', text)}
                            />
                        </View>
                    ))}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {upsertError && <Text style={styles.errorText}>{upsertError}</Text>}
                    {upsertLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <View style={styles.newHourContainer}>
                                <Text style={styles.label}>New Day</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newBusinessHour.day}
                                    onChangeText={(text) => setNewBusinessHour({ ...newBusinessHour, day: text })}
                                />
                                <Text style={styles.label}>New Open Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newBusinessHour.open_time}
                                    onChangeText={(text) => setNewBusinessHour({ ...newBusinessHour, open_time: text })}
                                />
                                <Text style={styles.label}>New Close Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newBusinessHour.close_time}
                                    onChangeText={(text) => setNewBusinessHour({ ...newBusinessHour, close_time: text })}
                                />
                                <Button title="Add Business Hour" onPress={handleAddBusinessHour} />
                            </View>
                            <Button title="Save" onPress={handleSave} />
                        </>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    hourContainer: {
        marginBottom: 20,
    },
    newHourContainer: {
        marginBottom: 20,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
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