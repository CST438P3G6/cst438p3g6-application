import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUpsertBusinessHours } from '@/hooks/useUpsertBusinessHours';
import { useViewBusinessHours } from '@/hooks/useViewBusinessHours';

type BusinessHour = {
    business_id: string;
    day: string;
    open_time: string;
    close_time: string;
};

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

export default function ModifyBusinessHoursPage() {
    const [businessId, setBusinessId] = useState<string>('');
    const { businessHours: fetchedHours, loading: fetching, error } = useViewBusinessHours(businessId);
    const { upsertBusinessHours, loading: upsertLoading, error: upsertError } = useUpsertBusinessHours();
    const [businessHours, setBusinessHours] = useState<BusinessHour[]>(
        daysOfWeek.map((day) => ({
            business_id: '',
            day,
            open_time: '',
            close_time: '',
        }))
    );

    useEffect(() => {
        if (fetchedHours) {
            const updatedHours = daysOfWeek.map((day) => {
                const existingHour = fetchedHours.find((hour) => hour.day === day);
                return existingHour || { business_id: businessId, day, open_time: '', close_time: '' };
            });
            setBusinessHours(updatedHours);
        }
    }, [fetchedHours, businessId]);

    const handleTimeChange = (index: number, field: 'open_time' | 'close_time', hour: string, minute: string) => {
        const updatedHours = [...businessHours];
        updatedHours[index][field] = `${hour}:${minute}`;
        setBusinessHours(updatedHours);
    };

    const handleCloseDay = (index: number) => {
        const updatedHours = [...businessHours];
        updatedHours[index].open_time = '00:00';
        updatedHours[index].close_time = '00:00';
        setBusinessHours(updatedHours);
    };

    const handleSave = async () => {
        for (const hour of businessHours) {
            const [openHour, openMinute] = hour.open_time.split(':').map(Number);
            const [closeHour, closeMinute] = hour.close_time.split(':').map(Number);

            if (!(openHour === 0 && openMinute === 0 && closeHour === 0 && closeMinute === 0)) {
                if (openHour > closeHour || (openHour === closeHour && openMinute >= closeMinute)) {
                    Alert.alert('Invalid Time', `Open time must be before close time for ${hour.day}.`);
                    return;
                }
            }
        }

        const updatedHours = businessHours.map((hour) => ({
            ...hour,
            business_id: businessId,
        }));

        const result = await upsertBusinessHours(updatedHours);

        if (result.error) {
            Alert.alert('Error updating business hours', result.error);
        } else {
            Alert.alert('Business hours updated successfully');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
            />
            {fetching ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {businessHours.map((hour, index) => (
                        <View key={index} style={styles.hourContainer}>
                            <View style={styles.dayRow}>
                                <Text style={styles.dayLabel}>{hour.day}</Text>
                                <TouchableOpacity
                                    style={styles.closedButton}
                                    onPress={() => handleCloseDay(index)}
                                >
                                    <Text style={styles.closedButtonText}>Closed</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={styles.timeLabel}>Open:</Text>
                                <Picker
                                    selectedValue={hour.open_time.split(':')[0] || '00'}
                                    onValueChange={(value) =>
                                        handleTimeChange(index, 'open_time', value, hour.open_time.split(':')[1] || '00')
                                    }
                                    style={styles.picker}
                                >
                                    {hours.map((h) => (
                                        <Picker.Item key={h} label={h} value={h} />
                                    ))}
                                </Picker>
                                <Text>:</Text>
                                <Picker
                                    selectedValue={hour.open_time.split(':')[1] || '00'}
                                    onValueChange={(value) =>
                                        handleTimeChange(index, 'open_time', hour.open_time.split(':')[0] || '00', value)
                                    }
                                    style={styles.picker}
                                >
                                    {minutes.map((m) => (
                                        <Picker.Item key={m} label={m} value={m} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={styles.timeLabel}>Close:</Text>
                                <Picker
                                    selectedValue={hour.close_time.split(':')[0] || '00'}
                                    onValueChange={(value) =>
                                        handleTimeChange(index, 'close_time', value, hour.close_time.split(':')[1] || '00')
                                    }
                                    style={styles.picker}
                                >
                                    {hours.map((h) => (
                                        <Picker.Item key={h} label={h} value={h} />
                                    ))}
                                </Picker>
                                <Text>:</Text>
                                <Picker
                                    selectedValue={hour.close_time.split(':')[1] || '00'}
                                    onValueChange={(value) =>
                                        handleTimeChange(index, 'close_time', hour.close_time.split(':')[0] || '00', value)
                                    }
                                    style={styles.picker}
                                >
                                    {minutes.map((m) => (
                                        <Picker.Item key={m} label={m} value={m} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    ))}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {upsertError && <Text style={styles.errorText}>{upsertError}</Text>}
                    {upsertLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button title="Save Business Hours" onPress={handleSave} />
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
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closedButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    closedButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    picker: {
        width: 70,
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