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
import {Search} from 'lucide-react-native';
import {useAllBusinesses} from '@/hooks/useAllBusinesses';

// Get device window dimensions
const {width} = Dimensions.get('window');

// Calculate number of columns based on screen width

export default function Home() {
  const router = useRouter();
  const {businesses, loading, error} = useAllBusinesses();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredBusinesses = businesses
    ? businesses.filter((business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const renderBusinessCard = ({ item }) => (
      <Pressable
          onPress={() => router.push(`/business/${item.id}`)}
          style={cardStyles.card}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardAddress}>{item.address}</Text>
      </Pressable>
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <TextInput
          placeholder="Search businesses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
          }}
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
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardAddress: {
    fontSize: 14,
    color: '#666',
  },
});

const cardStyles = StyleSheet.create({
  card: {
    width: width - 32,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    flexDirection: 'column',
    gap: 8,
  },
  cardContent: {
    flex: 1,
  },
});
