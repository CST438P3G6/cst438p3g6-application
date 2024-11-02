import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { fetchUserBusinesses } from '@/utils/viewUserBusinesses';
import LoggedInUserProfile from '@/utils/loggedInUserProfile';

type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    isadmin: boolean;
    isprovider: boolean;
    is_active: boolean;
};

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

export default function ViewUserBusinessesPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);

    const handleDataFetched = (fetchedData: Profile | null, fetchError: string | null) => {
        setProfile(fetchedData);
        setError(fetchError);
    };

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (profile) {
                const { data, error } = await fetchUserBusinesses(profile.id);
                if (error) {
                    Alert.alert('Error fetching businesses', error.message);
                } else {
                    setBusinesses(data || []);
                }
            }
        };

        fetchBusinesses();
    }, [profile]);

    return (
        <View style={styles.container}>
            <LoggedInUserProfile onDataFetched={handleDataFetched} />
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