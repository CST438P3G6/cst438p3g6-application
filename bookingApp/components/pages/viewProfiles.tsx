import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import useAllProfiles from "@/hooks/useAllProfiles";

export default function ViewProfiles() {
    const { data: profiles, error } = useAllProfiles();

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : profiles ? (
                <FlatList
                    data={profiles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.profileItem}>
                            <Text style={styles.nameText}>{item.first_name} {item.last_name}</Text>
                            <Text>{item.email}</Text>
                            <Text>{item.phone_number}</Text>
                            <Text>{item.isadmin ? "Admin" : "User"}</Text>
                            <Text>{item.isprovider ? "Provider" : "Customer"}</Text>
                            <Text>Status: {item.is_active ? "Active" : "Inactive"}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
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
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
    },
    profileItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
