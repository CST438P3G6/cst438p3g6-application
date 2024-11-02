import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useEditBusiness } from '@/hooks/useEditBusiness';
import { supabase } from '@/utils/supabase';

// Define the Business type based on your 'business' table structure
type Business = {
    id: string;
    name: string;
    description: string;
    phone_number: string;
    address: string;
    user_id: string;
    is_active: boolean;
    email: string;
};

export default function EditBusinessPage() {
    const { editBusiness, loading, error } = useEditBusiness();
    const [businessId, setBusinessId] = useState('');
    const [business, setBusiness] = useState<Business>({
        id: '',
        name: '',
        description: '',
        phone_number: '',
        address: '',
        user_id: '',
        is_active: true,
        email: ''
    });
    const [fetching, setFetching] = useState(false);

    const fetchBusiness = async () => {
        setFetching(true);
        const { data, error } = await supabase
            .from('business')
            .select('*')
            .eq('id', businessId)
            .single();

        if (error) {
            Alert.alert('Error fetching business', error.message);
        } else {
            const businessData = data as unknown as Business;
            setBusiness({
                id: businessData.id || '',
                name: businessData.name || '',
                description: businessData.description || '',
                phone_number: businessData.phone_number || '',
                address: businessData.address || '',
                user_id: businessData.user_id || '',
                is_active: businessData.is_active,
                email: businessData.email || ''
            });
        }
        setFetching(false);
    };

    const handleSave = async () => {
        const result = await editBusiness(business);

        if (result.error) {
            Alert.alert('Error updating business', result.error);
        } else {
            Alert.alert('Business updated successfully');
            console.log('Business updated:', business); // Placeholder action for testing
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
                style={styles.input}
                value={businessId}
                onChangeText={setBusinessId}
                placeholder="Enter Business ID"
            />
            <Button title="Fetch Business" onPress={fetchBusiness} disabled={!businessId || fetching} />

            {fetching && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

            {business.id && (
                <>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={business.name}
                        onChangeText={(text) => setBusiness({ ...business, name: text })}
                    />
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={business.description}
                        onChangeText={(text) => setBusiness({ ...business, description: text })}
                    />
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={business.phone_number}
                        onChangeText={(text) => setBusiness({ ...business, phone_number: text })}
                    />
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        value={business.address}
                        onChangeText={(text) => setBusiness({ ...business, address: text })}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={business.email}
                        onChangeText={(text) => setBusiness({ ...business, email: text })}
                    />
                    <Button title="Save" onPress={handleSave} disabled={loading} />
                </>
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
    loader: {
        marginVertical: 20,
    },
});