import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoggedInUserProfile from "@/utils/loggedInUserProfile";

// Define the Profile type based on your 'profiles' table structure
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

export default function ViewLoggedInUserProfile() {
    const [data, setData] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to handle data when fetched
    const handleDataFetched = (fetchedData: Profile | null, fetchError: string | null) => {
        setData(fetchedData);
        setError(fetchError);
    };

    return (
        <View style={styles.container}>
            {/* Call AllProfiles and pass the data handler */}
            <LoggedInUserProfile onDataFetched={handleDataFetched} />

            {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
                <Text style={styles.text}>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});