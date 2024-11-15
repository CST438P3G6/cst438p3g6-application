import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Alert, FlatList, Image} from 'react-native';
import {Text} from '@/components/ui/text';
import {useRouter} from 'expo-router';
import {Plus, Eye, Trash2, Settings} from 'lucide-react-native';
import {useUserBusinesses} from '@/hooks/useUserBusiness';
import {useLoggedInUserProfile} from '@/hooks/useLoggedInUserProfile';
import {supabase} from '@/utils/supabase';
import {useFocusEffect} from '@react-navigation/native';

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

export default function BusinessPage() {
  const router = useRouter();
  const {profile} = useLoggedInUserProfile();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    const {data: fetchedData, error: fetchError} = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', profile?.id || null);

    if (fetchError) {
      console.error(fetchError);
    } else {
      setBusinesses(fetchedData as unknown as Business[]);
    }
  };

  const {
    businesses: userBusinesses,
    loading,
    error,
  } = useUserBusinesses(profile?.id || null);

  useEffect(() => {
    if (!loading && !error) {
      setBusinesses(userBusinesses);
    }
  }, [businesses, loading, error]);

  useFocusEffect(
    React.useCallback(() => {
      setRefresh(true);
    }, []),
  );

  useEffect(() => {
    if (refresh) {
      fetchData();
      setRefresh(false);
    }
  }, [refresh]);

  const refetchData = () => {
    fetchData();
  };

  const handleDeleteBusiness = async (businessId: number) => {
    try {
      const {error} = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (error) throw error;
      Alert.alert('Success', 'Business deleted successfully');
      refetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete business');
    }
  };

  const renderBusinessItem = ({item}: {item: Business}) => (
    <View className="border-b border-gray-200 py-4">
      <Text className="text-lg font-semibold">{item.name}</Text>
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity
          onPress={() => {
            router.push(`/business/${item.id}`);
            refetchData();
          }}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Eye size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push(`/provider/editBusiness/${item.id}`);
            refetchData();
          }}
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
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Provider Dashboard</Text>
      <TouchableOpacity
        onPress={() => router.push('/provider/createBusiness')}
        className="flex-row items-center mb-4"
      >
        <Plus size={24} />
        <Text className="ml-2 text-base text-blue-500">Create Business</Text>
      </TouchableOpacity>

      {businesses.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBusinessItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </View>
  );
}
