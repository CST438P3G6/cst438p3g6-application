import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import EditProfile from '@/utils/editProfile';

const EditProfileForm: React.FC = () => {
    const {
        profile,
        loading,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        phoneNumber,
        setPhoneNumber,
        handleUpdateProfile,
    } = EditProfile();

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <Button title="Update Profile" onPress={handleUpdateProfile} />
        </View>
    );
};

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
});

export default EditProfileForm;