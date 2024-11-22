import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEditService } from '@/hooks/useEditService';
import { supabase } from '@/utils/supabase';
import Toast from 'react-native-toast-message';

type Service = {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  cost: number;
  time_needed: string;
};

const showToast = (type: 'success' | 'error', text1: string, text2: string) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom',
    visibilityTime: 1000,
  });
};

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { editService, loading: saveLoading } = useEditService();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service>({
    id: 0,
    business_id: 0,
    name: '',
    description: '',
    cost: 0,
    time_needed: '',
  });
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      const { data, error } = await supabase
          .from('service')
          .select('*')
          .eq('id', id)
          .single();
      if (error) {
        Alert.alert('Error', 'Failed to fetch service');
        router.back();
        return;
      }
      setService(data as Service);
      const [h, m] = data.time_needed.split(':');
      setHours(h);
      setMinutes(m);
      setLoading(false);
    };
    fetchService();
  }, [id]);

  const handleSave = async () => {
    if (!service.name || !service.cost || !hours || !minutes) {
      showToast('error', 'Error', 'Please fill in all required fields');
      return;
    }

    try {
      const updatedService = {
        ...service,
        time_needed: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
      };
      const result = await editService(updatedService);
      if (result.error) {
        showToast('error', 'Error', result.error);
      } else {
        showToast('success', 'Success', 'Service updated successfully');
        router.back();
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to save changes');
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
          <Text style={styles.title}>Edit Service</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Name *</Text>
            <TextInput
                style={styles.input}
                value={service.name}
                onChangeText={(text) => setService({ ...service, name: text })}
                placeholder="Enter service name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                value={service.description}
                onChangeText={(text) => setService({ ...service, description: text })}
                placeholder="Enter description"
                multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cost *</Text>
            <TextInput
                style={styles.input}
                value={service.cost.toString()}
                onChangeText={(text) =>
                    setService({ ...service, cost: parseFloat(text) || 0 })
                }
                placeholder="Enter cost"
                keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    flex: 0.48,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});