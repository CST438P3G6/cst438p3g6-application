import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Alert, FlatList, Image} from 'react-native';
import {Text} from '@/components/ui/text';
import {useRouter} from 'expo-router';
import {Plus, Eye, Trash2, Settings} from 'lucide-react-native';
import {useUserBusinesses} from '@/hooks/useUserBusiness';
import {useLoggedInUserProfile} from '@/hooks/useLoggedInUserProfile';
import {supabase} from '@/utils/supabase';

interface Business {
  id: number;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  user_id: string;
  is_active: boolean;
  email: string;
}

interface BusinessHours {
  business_id: number;
  day: string;
  open_time: string;
  close_time: string;
}

interface BusinessImage {
  id: number;
  business_id: number;
  image_url: string;
}

export default function BusinessPage() {
  const router = useRouter();
  const {profile} = useLoggedInUserProfile();
  const [businessHours, setBusinessHours] = useState<
    Record<number, BusinessHours[]>
  >({});
  const [businessImages, setBusinessImages] = useState<
    Record<number, BusinessImage[]>
  >({});
  const {
    businesses,
    loading,
    error: businessesError,
  } = useUserBusinesses(profile?.id || null);

  useEffect(() => {
    if (!businesses?.length) return;

    const fetchBusinessDetails = async () => {
      const businessIds = businesses.map((b) => b.id);

      const {data: hoursData} = await supabase
        .from('business_hours')
        .select('*')
        .in('business_id', businessIds);

      if (hoursData) {
        const hoursByBusiness = hoursData.reduce((acc, hour) => {
          acc[hour.business_id] = [...(acc[hour.business_id] || []), hour];
          return acc;
        }, {} as Record<number, BusinessHours[]>);
        setBusinessHours(hoursByBusiness);
      }

      const {data: imageData} = await supabase
        .from('business_images')
        .select('*')
        .in('business_id', businessIds);

      if (imageData) {
        const imagesByBusiness = imageData.reduce((acc, image) => {
          acc[image.business_id] = [...(acc[image.business_id] || []), image];
          return acc;
        }, {} as Record<number, BusinessImage[]>);
        setBusinessImages(imagesByBusiness);
      }
    };

    fetchBusinessDetails();
  }, [businesses]);

  const handleDeleteBusiness = async (businessId: number) => {
    try {
      const {error} = await supabase
        .from('business')
        .delete()
        .eq('id', businessId);

      if (error) throw error;
      Alert.alert('Success', 'Business deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete business');
    }
  };

  const renderBusinessItem = ({item}: {item: Business}) => (
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
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Provider Dashboard</Text>
      <TouchableOpacity
        onPress={() => router.push('/provider/createBusiness')}
        className="flex-row items-center mb-4"
      >
        <Plus size={24} />
        <Text className="ml-2 text-base text-blue-500">Create Business</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Loading...</Text>
      ) : businessesError ? (
        <Text>Error loading businesses: {businessesError}</Text>
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
