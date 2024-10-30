import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AllUsers from "@/utils/AllUsers";  // Make sure to use uppercase 'A'

// Define the User type again
type User = {
    id: number;
    username: string;
    password: string;
    email: string;
    isAdmin: boolean;
    isProvider: boolean;
};

export default function App() {
    const [data, setData] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to handle data when fetched
    const handleDataFetched = (fetchedData: User[] | null, fetchError: string | null) => {
        setData(fetchedData);
        setError(fetchError);
    };

    return (
        <View style={styles.container}>
            {/* Call AllUsers and pass the data handler */}
            <AllUsers onDataFetched={handleDataFetched} />

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
