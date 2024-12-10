import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useRouter} from 'expo-router';
import {Search} from 'lucide-react-native';
import {useAllBusinesses} from '@/hooks/useAllBusinesses';

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
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
    >
      <Text>{item.name}</Text>
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
    <SafeAreaView style={{flex: 1}}>
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
      />
    </SafeAreaView>
  );
}
