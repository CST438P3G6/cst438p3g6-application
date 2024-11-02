import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createBusiness } from '@/utils/createBusiness';

export default function CreateBusinessPage() {
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState(true);

    const handleCreateBusiness = async () => {
        if (!businessName || !description || !address || !phoneNumber || !email) {
            Alert.alert('Please fill in all fields');
            return;
        }

        const newBusiness = {
            name: businessName,
            description: description,
            address: address,
            phone_number: phoneNumber,
            email: email,
            is_active: isActive,
        };

        const { data, error } = await createBusiness(newBusiness);

        if (error) {
            Alert.alert('Error creating business', error.message);
        } else {
            Alert.alert('Business created successfully');
            // Clear form fields
            setBusinessName('');
            setDescription('');
            setAddress('');
            setPhoneNumber('');
            setEmail('');
            setIsActive(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
                style={styles.input}
                value={businessName}
                onChangeText={setBusinessName}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Create Business" onPress={handleCreateBusiness} />
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
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});