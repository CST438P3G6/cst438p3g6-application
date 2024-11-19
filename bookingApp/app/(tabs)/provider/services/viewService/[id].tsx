import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {ArrowLeft, Clock, DollarSign} from 'lucide-react-native';
import {supabase} from '@/utils/supabase';
import Toast from 'react-native-toast-message';

interface Service {
  id: number;
  name: string;
  description: string;
  cost: number;
  time_needed: string;
  business_id: number;
  is_active: boolean;
}

export default function ServiceDetailsPage() {
  const router = useRouter();
  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [id]);

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
      visibilityTime: 4000,
    });
  };

  const fetchService = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('service')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error: any) {
      showToast(
        'error',
        'Error',
        error.message || 'Failed to load service details',
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <DollarSign size={20} color="#666" />
            <Text style={styles.infoText}>${service.cost}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={20} color="#666" />
            <Text style={styles.infoText}>{service.time_needed}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{service.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
