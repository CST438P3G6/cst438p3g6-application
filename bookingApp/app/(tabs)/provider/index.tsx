import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {Text} from '@/components/ui/text';
import {Button} from '@/components/ui/button';
import {useRouter} from 'expo-router';
import {Plus, Eye, Trash2, Settings} from 'lucide-react-native';
import {useUserBusinesses} from '@/hooks/useUserBusiness';
import {supabase} from '@/utils/supabase';
import {useUser} from '@/context/UserContext';

interface Business {
  id: string;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  user_id: string;
  is_active: boolean;
  email: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const {profile} = useUser();
  const {businesses, loading, error, refetch} = useUserBusinesses(
    profile?.id || null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const {error} = await supabase
        .from('business')
        .delete()
        .eq('id', businessId);

      if (error) throw error;
      Alert.alert('Success', 'Business deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete business');
      console.error(error);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel('business_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (insert, update, delete)
          schema: 'public',
          table: 'business',
        },
        async (payload) => {
          // Refetch data when any change occurs
          await refetch();
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [refetch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderBusinessItem = ({item}: {item: Business}) => (
    // This is basically a component
    <View className="border-b border-gray-200 py-4">
      <Text className="text-lg font-semibold">{item.name}</Text>
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity
          onPress={() => router.push(`/business/${item.id}`)}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Eye size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/provider/editBusiness/${item.id}`)}
          className="p-2 bg-blue-200 rounded-full"
        >
          <Settings size={20} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteBusiness(item.id)}
          className="p-2 bg-red-200 rounded-full"
        >
          <Trash2 size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <Button
          onPress={() => router.push('/provider/createBusiness')}
          variant="default"
          className="flex-row justify-center items-center p-2 w-full"
        >
          <Plus size={16} color="white" />
          <Text className="ml-2">Create Business</Text>
        </Button>
        <Text className="text-xl font-bold">My Businesses</Text>
      </View>

      <FlatList
        data={businesses}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text>No businesses found</Text>
          </View>
        }
      />
    </View>
  );
}
