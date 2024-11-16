import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {supabase} from '@/utils/supabase';
import {
  Star,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react-native';

interface Business {
  id: number;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  email: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  cost: number;
  time_needed: string;
  is_active: boolean;
}

interface Review {
  id: number;
  body: string;
  rating: number;
  user_id: string;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default function BusinessDetails() {
  const {id} = useLocalSearchParams<{id: string}>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupRealtime();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [businessData, servicesData, reviewsData] = await Promise.all([
        supabase
          .from('business')
          .select<'business', Business>('*')
          .eq('id', id)
          .single(),
        supabase
          .from('service')
          .select<'service', Service>('*')
          .eq('business_id', id),
        supabase
          .from('reviews')
          .select<'reviews', Review>('*')
          .eq('business_id', id),
      ]);

      if (businessData.error) throw businessData.error;
      if (servicesData.error) throw servicesData.error;
      if (reviewsData.error) throw reviewsData.error;

      setBusiness(businessData.data);
      setServices(servicesData.data || []);
      setReviews(reviewsData.data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load business details');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('business_details')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business',
          filter: `id=eq.${id}`,
        },
        fetchData,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service',
          filter: `business_id=eq.${id}`,
        },
        fetchData,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `business_id=eq.${id}`,
        },
        fetchData,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!business) {
    return (
      <View>
        <Text>Business not found</Text>
      </View>
    );
  }

  const averageRating = reviews.length
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;

  return (
    <ScrollView>
      <View>
        <View>
          <Text>{business.name}</Text>
          <Text>{business.description}</Text>

          <View>
            <View>
              <Phone size={20} />
              <Text>{business.phone_number}</Text>
            </View>
            <View>
              <Mail size={20} />
              <Text>{business.email}</Text>
            </View>
            <View>
              <MapPin size={20} />
              <Text>{business.address}</Text>
            </View>
          </View>
        </View>

        {/* Services */}
        <View>
          <Text>Services</Text>
          {services.map((service) => (
            <View key={service.id}>
              <Text>{service.name}</Text>
              <Text className="text-gray-600">{service.description}</Text>
              <View className="flex-row mt-2 space-x-4">
                <View className="flex-row items-center">
                  <DollarSign size={16} className="text-gray-500 mr-1" />
                  <Text>${service.cost}</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <Text>{service.time_needed}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-xl font-bold">Reviews</Text>
            <View className="flex-row items-center ml-2">
              <Star size={16} color="#FFD700" />
              <Text className="ml-1">{averageRating.toFixed(1)}</Text>
            </View>
          </View>

          {reviews.map((review) => (
            <View
              key={review.id}
              className="bg-white p-4 rounded-lg mb-2 shadow-sm"
            >
              <View className="flex-row mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < review.rating ? '#FFD700' : '#E5E7EB'}
                  />
                ))}
              </View>
              <Text>{review.body}</Text>
            </View>
          ))}
        </View>

        <View style={{marginBottom: 16}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: '/booking/[id]',
                params: {id},
              })
            }
          >
            <Text style={{color: 'white', fontWeight: '600'}}>
              Book Appointment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#3b82f6',
              },
            ]}
            onPress={() =>
              router.push({
                pathname: '/contact/[id]',
                params: {id},
              })
            }
          >
            <Text style={{color: '#3b82f6', fontWeight: '600'}}>
              Contact Business
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
