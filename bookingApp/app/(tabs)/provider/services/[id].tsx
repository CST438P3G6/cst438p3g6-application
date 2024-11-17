import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Plus, Eye, Trash2, Settings} from 'lucide-react-native';
import {supabase} from '@/utils/supabase';

interface Service {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  cost: number;
  time_needed: string;
  is_active?: boolean;
}

export default function BusinessServices() {
  const {id} = useLocalSearchParams();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    const {data, error} = await supabase
      .from('service')
      .select('*')
      .eq('business_id', id);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setServices(data as Service[]);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchServices();

    const subscription = supabase
      .channel('service_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (insert, update, delete)
          schema: 'public',
          table: 'service',
        },
        async (payload) => {
          // Refetch data when any change occurs
          await fetchServices();
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDeleteService = async (serviceId: number) => {
    try {
      const {error} = await supabase
        .from('service')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      Alert.alert('Success', 'Service deleted successfully');
      await fetchServices();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete service');
      console.error(error);
    }
  };

  const renderServiceItem = ({item}: {item: Service}) => (
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
          onPress={() => router.push(`./viewService/${item.id}`)}
          style={{padding: 8, backgroundColor: '#e5e7eb', borderRadius: 20}}
        >
          <Eye size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/provider/services/edit/${item.id}`)}
          style={{padding: 8, backgroundColor: '#bae6fd', borderRadius: 20}}
        >
          <Settings size={20} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteService(item.id)}
          style={{padding: 8, backgroundColor: '#fecaca', borderRadius: 20}}
        >
          <Trash2 size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

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

  return (
    <View style={{flex: 1, padding: 16}}>
      <View style={{marginBottom: 16}}>
        <TouchableOpacity
          onPress={() => router.push(`/provider/services/createService/${id}`)}
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
          <Text style={{marginLeft: 8, color: 'white'}}>Create Service</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 8}}>
          Services
        </Text>
      </View>

      <FlatList
        data={services}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Text>No services found</Text>
          </View>
        }
      />
    </View>
  );
}
