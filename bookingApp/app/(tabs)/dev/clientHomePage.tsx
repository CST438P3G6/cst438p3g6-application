import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, FlatList, Button } from 'react-native';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <View className="mt-4 p-2 border rounded-md bg-gray-100">
    <TextInput
      placeholder="Search for services, locations..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={{ padding: 10 }}
      className="text-gray-600"
    />
  </View>
);

function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('business').select('*');
      if (error) {
        setError(error.message);
      } else {
        setBusinesses(data);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  // Query
  const filteredBusinesses = businesses.filter(business =>
    typeof business.name === 'string' && business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading businesses: {error}</Text>;

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className='flex-1 justify-center'>
        <Text>LARGE LOGO OF SOME KIND</Text>
      </View>

      <View className="mb-6">
        <Text className="text-2xl font-semibold">Business Search</Text>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>

      {searchQuery.trim() !== '' && (
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4">Search Results</Text>
          <FlatList
            data={filteredBusinesses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="p-4 border rounded-md bg-gray-200 mb-2 flex-row justify-between items-center">
                <View>
                  <Text className="font-bold">{item.name}</Text>
                  <Text>{item.description}</Text>
                  <Text>{item.phone_number}</Text>
                </View>
                <Button
                  title="Make an Appointment"
                  onPress={() => {
                    console.log('Button Pressed for:', item.name);
                  }}
                />
              </View>
            )}
            ListEmptyComponent={<Text>No results found.</Text>}
          />
        </View>
      )}
      
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Recommended (maybe grabs random businesses)</Text>
        <View className="h-32 rounded-md bg-gray-200 mb-4" />
        <View className="h-32 rounded-md bg-gray-200" />
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Upcoming Booking (probably the first booking)</Text>
        <View className="h-24 rounded-md bg-gray-200" />
      </View>
    </ScrollView>
  );
}

export default Home;
