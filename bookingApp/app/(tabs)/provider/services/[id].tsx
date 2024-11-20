import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Text,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Plus, Eye, Trash2, Settings} from 'lucide-react-native';
import {supabase} from '@/utils/supabase';
import Toast from 'react-native-toast-message';
import {useDeactivateService} from '@/hooks/useDeactivateService';

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
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setFetchError(null);

    const {data, error} = await supabase
      .from('service')
      .select('*')
      .eq('business_id', id);

    setLoading(false);

    if (fetchError) {
      setFetchError(error.message);
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
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setServices((prev) => [payload.new as Service, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setServices((prev) =>
              prev.map((item) =>
                item.id === (payload.new as Service).id
                  ? (payload.new as Service)
                  : item,
              ),
            );
          } else if (payload.eventType === 'DELETE') {
            setServices((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const showToast = (
    type: 'success' | 'error',
    text1: string,
    text2: string,
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      visibilityTime: 1000,
    });
  };

  const {
    deactivateService,
    loading: deactivating,
    error,
  } = useDeactivateService();

  const handleDeleteService = async (serviceId: number) => {
    if (deactivating) {
      showToast('error', 'Please wait', 'Service is being deactivated');
      return;
    }

    const success = await deactivateService(serviceId);

    if (success) {
      showToast(
        'success',
        'Service Deactivated',
        'The service has been deactivated successfully',
      );
      setServices((prev) => prev.filter((service) => service.id !== serviceId));
    } else {
      showToast('error', 'Error', error || 'Failed to deactivate service');
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error: {fetchError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      </View>

      <FlatList
        data={services}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
