import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import {Text} from '@/components/ui/text';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useRouter} from 'expo-router';
import {useCreateBusiness} from '@/hooks/useCreateBusiness';

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
    };
    const {data, error} = await createBusiness(business);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Business created successfully');
      router.push('/provider');
    }
  };

  return (
    <View>
      <Text>Create Business</Text>
      <Input placeholder="Name" value={name} onChangeText={setName} />
      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Input
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Input placeholder="Address" value={address} onChangeText={setAddress} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Button onPress={handleCreateBusiness} disabled={loading}>
        {loading ? 'Creating...' : 'Create Business'}
      </Button>
      {error && <Text>{error.message}</Text>}
    </View>
  );
}
