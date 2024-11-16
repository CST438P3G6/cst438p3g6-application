import React, {useState} from 'react';
import {
  View,
  Alert,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useRouter} from 'expo-router';
import {useCreateBusiness} from '@/hooks/useCreateBusiness';
import {CheckCircle, XCircle} from 'lucide-react-native';

export default function CreateBusiness() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const {createBusiness, loading, error} = useCreateBusiness();

  const handleCreateBusiness = async () => {
    const business = {
      name,
      description,
      phone_number: phoneNumber,
      address,
      email,
      is_active: true,
    };
    const {data, error} = await createBusiness(business);
    if (error) {
      Alert.alert('Error', error, [{text: 'OK'}]);
    } else {
      Alert.alert('Success', 'Business created successfully', [{text: 'OK'}]);
      router.push('/provider');
    }
  };

  return (
    <View>
      <Text>Create Business</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button
        onPress={handleCreateBusiness}
        disabled={loading}
        title={loading ? 'Creating...' : 'Create Business'}
      />
      {loading && <ActivityIndicator />}
      {error && <Text>{error}</Text>}
    </View>
  );
}
