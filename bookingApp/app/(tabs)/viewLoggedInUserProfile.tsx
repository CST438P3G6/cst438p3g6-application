import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useLoggedInUserProfile} from "@/hooks/useLoggedInUserProfile";

export default function ViewLoggedInUserProfile() {
    const { profile: data, error } = useLoggedInUserProfile();

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : data ? (
                <View>
                    <Text style={styles.text}>ID: {data.id}</Text>
                    <Text style={styles.text}>Name: {data.first_name} {data.last_name}</Text>
                    <Text style={styles.text}>Email: {data.email}</Text>
                    <Text style={styles.text}>Phone: {data.phone_number}</Text>
                    <Text style={styles.text}>Role: {data.isadmin ? "Admin" : "User"}</Text>
                    <Text style={styles.text}>Status: {data.is_active ? "Active" : "Inactive"}</Text>
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        marginVertical: 4,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
