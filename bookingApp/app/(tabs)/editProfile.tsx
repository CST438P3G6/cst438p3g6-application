import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import useEditProfile from "@/hooks/useEditProfile"; // Update the path to match your hook

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
    } = useEditProfile();

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
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
                keyboardType="phone-pad"
            />
            <View style={styles.checkboxContainer}>
                <Switch
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