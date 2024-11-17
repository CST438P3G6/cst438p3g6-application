import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
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

  const renderBusinessItem = ({item}: {item: Business}) => (
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        paddingVertical: 16,
      }}
    >
      <Text style={{fontSize: 18, fontWeight: '600'}}>{item.name}</Text>
      <View style={{flexDirection: 'row', gap: 16, marginTop: 16}}>
        <TouchableOpacity
          onPress={() => router.push(`/business/${item.id}`)}
          style={{padding: 8, backgroundColor: '#e5e7eb', borderRadius: 20}}
        >
          <Eye size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/provider/editBusiness/${item.id}`)}
          style={{padding: 8, backgroundColor: '#bae6fd', borderRadius: 20}}
        >
          <Settings size={20} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteBusiness(item.id)}
          style={{padding: 8, backgroundColor: '#fecaca', borderRadius: 20}}
        >
          <Trash2 size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, padding: 16}}>
      <View style={{marginBottom: 16}}>
        <TouchableOpacity
          onPress={() => router.push('/provider/createBusiness')}
          style={{
            backgroundColor: '#2196F3',
            padding: 8,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Plus size={16} color="white" />
          <Text style={{marginLeft: 8, color: 'white'}}>Create Business</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 8}}>
          My Businesses
        </Text>
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
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Text>No businesses found</Text>
          </View>
        }
      />
    </View>
  );
}
