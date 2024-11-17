import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAllBusinesses} from "@/hooks/useAllBusinesses";

export default function ViewAllBusinessesPage() {
    const { businesses, loading, error } = useAllBusinesses();

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : businesses ? (
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
            ) : (
                <Text style={styles.loadingText}>No businesses found</Text>
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
