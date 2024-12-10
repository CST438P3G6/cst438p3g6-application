import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, Text } from 'react-native';
import { useDisownBusiness } from '@/hooks/useDisownBusiness';

const DisownBusinessPage: React.FC = () => {
    const [businessId, setBusinessId] = useState<number | null>(null);
    const { disownBusiness, loading, error } = useDisownBusiness();

    const handleDisownBusiness = async () => {
        if (businessId === null) {
            Alert.alert('Error', 'Please enter a valid business ID');
            return;
        }

        const { data, error } = await disownBusiness(businessId);
        if (error) {
            Alert.alert('Error', error);
        } else {
            Alert.alert('Success', 'Business disowned successfully');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Disown Business</Text>
            <TextInput
                placeholder="Business ID"
                keyboardType="numeric"
                value={businessId !== null ? businessId.toString() : ''}
                onChangeText={(text) => setBusinessId(Number(text))}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
            />
            <Button onPress={handleDisownBusiness} title="Disown Business" disabled={loading} />
            {loading && <ActivityIndicator />}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </View>
    );
};

export default DisownBusinessPage;