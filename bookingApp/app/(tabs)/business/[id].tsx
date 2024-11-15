import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {Text} from '@/components/ui/text';
import {Button} from '@/components/ui/button';
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

export default function BusinessDetails() {
  const {id} = useLocalSearchParams();
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
        supabase.from('business').select('*').eq('id', id).single(),
        supabase.from('service').select('*').eq('business_id', id),
        supabase.from('reviews').select('*').eq('business_id', id),
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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!business) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Business not found</Text>
      </View>
    );
  }

  const averageRating = reviews.length
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Business Info */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-2xl font-bold">{business.name}</Text>
          <Text className="text-gray-600 mt-2">{business.description}</Text>

          <View className="mt-4 space-y-2">
            <View className="flex-row items-center">
              <Phone size={20} className="text-gray-500 mr-2" />
              <Text>{business.phone_number}</Text>
            </View>
            <View className="flex-row items-center">
              <Mail size={20} className="text-gray-500 mr-2" />
              <Text>{business.email}</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={20} className="text-gray-500 mr-2" />
              <Text>{business.address}</Text>
            </View>
          </View>
        </View>

        {/* Services */}
        <View className="mb-4">
          <Text className="text-xl font-bold mb-2">Services</Text>
          {services.map((service) => (
            <View
              key={service.id}
              className="bg-white p-4 rounded-lg mb-2 shadow-sm"
            >
              <Text className="font-semibold text-lg">{service.name}</Text>
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

        {/* Action Buttons */}
        <View className="space-y-2 mb-4">
          <Button
            onPress={() => router.push(`/booking/${id}`)}
            className="w-full"
          >
            Book Appointment
          </Button>
          <Button
            variant="outline"
            onPress={() => router.push(`/contact/${id}`)}
            className="w-full"
          >
            Contact Business
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
