import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useRouter} from 'expo-router';
import {useCreateBusiness} from '@/hooks/useCreateBusiness';
import Toast from 'react-native-toast-message';

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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        position: 'bottom',
        visibilityTime: 1000,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Business created successfully',
        position: 'bottom',
        visibilityTime: 1000,
      });
      router.push('/provider');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Business</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Create Business" onPress={handleCreateBusiness} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
