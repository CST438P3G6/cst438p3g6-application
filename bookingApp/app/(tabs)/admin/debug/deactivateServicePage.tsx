import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, Text } from 'react-native';
import { useDeactivateService } from '@/hooks/useDeactivateService';

const DeactivateServicePage: React.FC = () => {
    const [serviceId, setServiceId] = useState<number | null>(null);
    const { deactivateService, loading, error } = useDeactivateService();

    const handleDeactivateService = async () => {
        if (serviceId === null) {
            Alert.alert('Error', 'Please enter a valid service ID');
            return;
        }

        const { data, error } = await deactivateService(serviceId);
        if (error) {
            Alert.alert('Error', error);
        } else {
            Alert.alert('Success', 'Service deactivated successfully');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Deactivate Service</Text>
            <TextInput
                placeholder="Service ID"
                keyboardType="numeric"
                value={serviceId !== null ? serviceId.toString() : ''}
                onChangeText={(text) => setServiceId(Number(text))}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
            />
            <Button onPress={handleDeactivateService} title="Deactivate Service" disabled={loading} />
            {loading && <ActivityIndicator />}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </View>
    );
};

export default DeactivateServicePage;