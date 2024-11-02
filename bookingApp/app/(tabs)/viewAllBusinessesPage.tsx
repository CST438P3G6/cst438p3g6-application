import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { fetchAllBusinesses} from "@/utils/viewAllBusinesses";

type Business = {
    id: string;
    name: string;
    description: string;
    phone_number: string;
    address: string;
    user_id: string;
    is_active: boolean;
    email: string;
};

export default function ViewAllBusinessesPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const { data, error } = await fetchAllBusinesses();
            if (error) {
                setError(error.message);
                Alert.alert('Error fetching businesses', error.message);
            } else {
                setBusinesses(data || []);
            }
        };

        fetchBusinesses();
    }, []);

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
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