import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../utils/supabase';

export default function CreateBusiness() {
    const [userId, setUserId] = useState('');
    const [description, setDescription] = useState('');
    const [businessHours, setBusinessHours] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('business')
            .insert([
                {
                    user_id: parseInt(userId, 10),
                    description,
                    business_hours: businessHours,
                    phone_number: phoneNumber,
                    address,
                },
            ]);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Business created successfully');
            setUserId('');
            setDescription('');
            setBusinessHours('');
            setPhoneNumber('');
            setAddress('');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.label}>Business Hours</Text>
            <TextInput
                style={styles.input}
                value={businessHours}
                onChangeText={setBusinessHours}
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
            />
            <Button title="Create Business" onPress={handleSubmit} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});