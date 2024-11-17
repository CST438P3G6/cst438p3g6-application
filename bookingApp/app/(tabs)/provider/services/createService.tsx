import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {useRouter} from 'expo-router';
import {useCreateService} from '@/hooks/useCreateService';
import {useLocalSearchParams} from 'expo-router';

export default function CreateServicePage() {
  const router = useRouter();
  const {createService, loading} = useCreateService();
  const {businessId} = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    time_needed: '',
    business_id: businessId,
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.cost || !formData.time_needed) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const serviceData = {
      ...formData,
      cost: Number(formData.cost),
      is_active: true,
    };

    const {error} = await createService(serviceData);

    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Success', 'Service created successfully', [
        {text: 'OK', onPress: () => router.back()},
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Service Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
        placeholder="Enter service name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.description}
        onChangeText={(text) => setFormData({...formData, description: text})}
        placeholder="Enter service description"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Cost ($) *</Text>
      <TextInput
        style={styles.input}
        value={formData.cost}
        onChangeText={(text) => setFormData({...formData, cost: text})}
        placeholder="Enter cost"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Duration *</Text>
      <TextInput
        style={styles.input}
        value={formData.time_needed}
        onChangeText={(text) => setFormData({...formData, time_needed: text})}
        placeholder="Enter duration (e.g., 30 mins, 1 hour)"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Service'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
