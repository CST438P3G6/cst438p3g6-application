import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {ArrowLeft, Save} from 'lucide-react-native';
import {useEditBusiness} from '@/hooks/useEditBusiness';
import {supabase} from '@/utils/supabase';
import Toast from 'react-native-toast-message';

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
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch business',
          position: 'bottom',
          visibilityTime: 4000,
        });
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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Name and email are required',
        position: 'bottom',
        visibilityTime: 4000,
      });
      return;
    }

    const result = await editBusiness(business);

    if (result.error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result.error,
        position: 'bottom',
        visibilityTime: 4000,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Business updated successfully',
        position: 'bottom',
        visibilityTime: 4000,
      });
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Business</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={business.name}
            onChangeText={(text) => setBusiness({...business, name: text})}
            placeholder="Enter business name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={business.description}
            onChangeText={(text) =>
              setBusiness({...business, description: text})
            }
            placeholder="Enter description"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={business.phone_number}
            onChangeText={(text) =>
              setBusiness({...business, phone_number: text})
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={business.address}
            onChangeText={(text) => setBusiness({...business, address: text})}
            placeholder="Enter address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={business.email}
            onChangeText={(text) => setBusiness({...business, email: text})}
            placeholder="Enter email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={saveLoading}
          >
            <Save size={20} color="white" />
            <Text style={styles.buttonText}>
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
