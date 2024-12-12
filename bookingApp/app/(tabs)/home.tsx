import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useRouter} from 'expo-router';
import {useAllBusinesses} from '@/hooks/useAllBusinesses';

// Get device window dimensions
const {width} = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const {businesses, loading, error} = useAllBusinesses();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredBusinesses = businesses
    ? businesses.filter((business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const renderBusinessCard = ({item}) => (
    <Pressable
      onPress={() => router.push(`/business/${item.id}`)}
      style={[cardStyles.card]}
    >
      <Text style={cardStyles.cardText}>{item.name}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Businesses</Text>
        <TextInput
          placeholder="Search businesses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 12}} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FF', 
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF', 
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    width: width - 32, // Full width minus padding
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    
    flexDirection: 'column',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
