import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useRouter} from 'expo-router';
import {AlertCircle} from 'lucide-react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AlertCircle size={48} color="#4B5563" style={styles.icon} />
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <Text style={styles.subtitle}>This is the +not-found.tsx</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={styles.buttonText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
