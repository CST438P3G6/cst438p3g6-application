import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useCreateService } from '@/hooks/useCreateService';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function CreateServicePage() {
  const { businessId } = useLocalSearchParams();
  const router = useRouter();
  const { createService, loading } = useCreateService();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    time_needed: '',
    business_id: Number(businessId),
  });
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.cost || !hours || !minutes) {
      showToast('error', 'Error', 'Please fill in all required fields');
      return;
    }

    const serviceData = {
      ...formData,
      cost: Number(formData.cost),
      time_needed: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
      is_active: true,
    };

    const { error } = await createService(serviceData);

    if (error) {
      showToast('error', 'Error', error.message || 'Failed to create service');
    } else {
      showToast('success', 'Success', 'Service created successfully');
      router.back();
    }
  };

  return (
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter service name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Enter service description"
            multiline
            numberOfLines={4}
        />

        <Text style={styles.label}>Cost ($) *</Text>
        <TextInput
            style={styles.input}
            value={formData.cost}
            onChangeText={(text) => setFormData({ ...formData, cost: text })}
            placeholder="Enter cost"
            keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Duration *</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Hours</Text>
            <Picker
                selectedValue={hours}
                style={styles.picker}
                onValueChange={(itemValue) => setHours(itemValue)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
          <Text style={styles.pickerSeparator}>:</Text>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Minutes</Text>
            <Picker
                selectedValue={minutes}
                style={styles.picker}
                onValueChange={(itemValue) => setMinutes(itemValue)}
            >
              {Array.from({ length: 11 }, (_, i) => (
                  <Picker.Item key={i} label={`${(i + 1) * 5}`} value={`${(i + 1) * 5}`} />
              ))}
            </Picker>
          </View>
        </View>

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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  picker: {
    width: 'auto',
    fontSize: 16,
  },
  pickerSeparator: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
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