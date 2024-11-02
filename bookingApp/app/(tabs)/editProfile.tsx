import React from 'react';
// @ts-ignore
import { View, Text, TextInput, Button, StyleSheet, CheckBox } from 'react-native';
import EditProfile from '@/utils/editProfile';

const EditProfileForm: React.FC = () => {
    const {

        loading,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        phoneNumber,
        setPhoneNumber,
        isProvider,
        setIsProvider,
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
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={isProvider}
                    onValueChange={setIsProvider}
                />
                <Text style={styles.label}>Is Provider</Text>
            </View>
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
});

export default EditProfileForm;