import React, {useEffect, useState} from 'react';
import {View, Alert, ScrollView, ActivityIndicator} from 'react-native';
import {Text} from '@/components/ui/text';
import {Button} from '@/components/ui/button';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Input} from '@/components/ui/input';
import {useEditBusiness} from '@/hooks/useEditBusiness';
import {supabase} from '@/utils/supabase';

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

interface Params {
  id: string;
}

export default function EditBusinessPage() {
  const router = useRouter();
  const {id} = useLocalSearchParams<Params>();
  const {editBusiness, loading: saveLoading} = useEditBusiness();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business>({
    id: '',
    name: '',
    description: '',
    phone_number: '',
    address: '',
    user_id: '',
    is_active: true,
    email: '',
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      const {data, error} = await supabase
        .from('business')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        Alert.alert('Error', 'Failed to fetch business');
        router.back();
        return;
      }

      setBusiness(data as Business);
      setLoading(false);
    };

    fetchBusiness();
  }, [id]);

  const handleSave = async () => {
    if (!business.name || !business.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    const result = await editBusiness(business);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Success', 'Business updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <View className="space-y-4">
        <Text className="text-xl font-bold mb-4">Edit Business</Text>

        <View>
          <Text className="mb-2">Business Name</Text>
          <Input
            value={business.name}
            onChangeText={(text) => setBusiness({...business, name: text})}
            placeholder="Enter business name"
          />
        </View>

        <View>
          <Text className="mb-2">Description</Text>
          <Input
            value={business.description}
            onChangeText={(text) =>
              setBusiness({...business, description: text})
            }
            placeholder="Enter description"
            multiline
          />
        </View>

        <View>
          <Text className="mb-2">Phone Number</Text>
          <Input
            value={business.phone_number}
            onChangeText={(text) =>
              setBusiness({...business, phone_number: text})
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View>
          <Text className="mb-2">Address</Text>
          <Input
            value={business.address}
            onChangeText={(text) => setBusiness({...business, address: text})}
            placeholder="Enter address"
          />
        </View>

        <View>
          <Text className="mb-2">Email</Text>
          <Input
            value={business.email}
            onChangeText={(text) => setBusiness({...business, email: text})}
            placeholder="Enter email"
            keyboardType="email-address"
          />
        </View>

        <View className="flex-row space-x-4">
          <Button
            className="flex-1"
            variant="destructive"
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onPress={handleSave}
            disabled={saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
