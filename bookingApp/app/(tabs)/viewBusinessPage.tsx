import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useViewBusiness } from '@/hooks/useViewBusiness';

export default function ViewBusinessPage() {
    const [businessId, setBusinessId] = useState<string>('');
    const { business, loading, error } = useViewBusiness(businessId);


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
            />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {business && (
                <View style={styles.businessContainer}>
                    <Text>Name: {business.name}</Text>
                    <Text>Description: {business.description}</Text>
                    <Text>Phone Number: {business.phone_number}</Text>
                    <Text>Address: {business.address}</Text>
                    <Text>Email: {business.email}</Text>
                    <Text>Is Active: {business.is_active ? 'Yes' : 'No'}</Text>
                </View>
            )}
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
    businessContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});