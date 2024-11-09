import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLoggedInUserProfile} from "@/hooks/useLoggedInUserProfile";
import { useUserBusinesses} from "@/hooks/useUserBusiness";

export default function ViewUserBusinessesPage() {
    const { profile, error: profileError } = useLoggedInUserProfile();
    const { businesses, loading, error: businessesError } = useUserBusinesses(profile?.id || null);

    return (
        <View style={styles.container}>
            {profileError ? (
                <Text style={styles.errorText}>Error: {profileError}</Text>
            ) : businessesError ? (
                <Text style={styles.errorText}>Error: {businessesError}</Text>
            ) : loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={businesses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.businessItem}>
                            <Text style={styles.businessName}>{item.name}</Text>
                            <Text>{item.description}</Text>
                            <Text>{item.address}</Text>
                            <Text>{item.phone_number}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    businessItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    businessName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
