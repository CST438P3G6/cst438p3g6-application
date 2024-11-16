// ok this home page wont have subpages. but is the entry point of (tabs)/
import React, {useEffect, useState} from 'react';
import {View, ScrollView, TextInput, FlatList, Button, Pressable} from 'react-native';
import {Text} from '@/components/ui/text';
import {supabase} from '@/utils/supabase';
import {useRouter} from 'expo-router';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({searchQuery, setSearchQuery}) => (
  <View className="mt-4 p-2 border rounded-md bg-gray-100">
    <TextInput
      placeholder="Search for services, locations..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={{padding: 10}}
      className="text-gray-600"
    />
  </View>
);

interface Business {
  id: string;
  name: string;
  phone_number: string;
  image?: string;
}

function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const {data, error} = await supabase.from('business').select('*');
      if (error) {
        setError(error.message);
      } else {
        setBusinesses(data || []);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  //the search
  const filteredBusinesses = businesses.filter(
    (business) =>
      typeof business.name === 'string' &&
      business.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleMakeAppointment = (business: Business) => {
    // Navigate to the Appointments screen and pass the business details
    router.push({
      pathname: '/appointments',
      params: {businessName: business.name, businessId: business.id},
    });
  };

  const BusinessItem = ({item}: {item: Business}) => (
    <View className="p-4 bg-white rounded-lg shadow-sm mb-4">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-semibold">{item.name}</Text>
          <Text className="text-gray-600">{item.phone_number}</Text>
        </View>
        <Pressable
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => handleMakeAppointment(item)}
        >
          <Text className="text-white">Book Now</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading businesses: {error}</Text>;

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Business Search</Text>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>

      {searchQuery.trim() !== '' && (
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4">Search Results</Text>
          <FlatList
            data={filteredBusinesses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <View className="p-4 border rounded-md bg-gray-200 mb-2 flex-row justify-between items-center">
                <View>
                  <Text className="font-bold">{item.name}</Text>
                  <Text>{item.phone_number}</Text>
                </View>
                <Button
                  title="Make an Appointment"
                  onPress={() => handleMakeAppointment(item)}
                />
              </View>
            )}
            ListEmptyComponent={<Text>No results found.</Text>}
          />
        </View>
      )}

      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Recommended Businesses</Text>
        <FlatList
          data={businesses.slice(0, 2)} //want to randomise the businesses next instead of showing first 2
          renderItem={({item}) => <BusinessItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text className="text-center text-gray-500">No recommended businesses</Text>}
        />
      </View>

    </ScrollView>
  );
}

export default Home;
