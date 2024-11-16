import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {useRouter} from 'expo-router';
import {supabase} from '@/utils/supabase';
import {UserPlus, Mail, Lock, User, Phone} from 'lucide-react-native';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signUpWithEmail = async () => {
    setLoading(true);
    try {
      const {
        data: {user},
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (user) {
        const {error: profileInsertError} = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone_number: phoneNumber,
              isadmin: isAdmin,
              isprovider: isProvider,
              is_active: true,
            },
          ]);

        if (profileInsertError) {
          console.error('Profile creation error:', profileInsertError);
          Alert.alert('Error', profileInsertError.message);
        } else {
          console.log('User signed up and profile created');
          router.replace('/(tabs)/home');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Signup failed', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <UserPlus size={32} color="#000" style={styles.headerIcon} />
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.description}>Create your account</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <User size={20} color="#666" />
            <TextInput
              placeholder="First Name"
              value={firstName}
              style={styles.input}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Mail size={20} color="#666" />
            <TextInput
              placeholder="Email"
              value={email}
              style={styles.input}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#666" />
            <TextInput
              placeholder="Password"
              value={password}
              style={styles.input}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <View style={styles.inputWrapper}>
            <Phone size={20} color="#666" />
            <TextInput
              placeholder="Phone Number"
              value={phoneNumber}
              style={styles.input}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Admin Access</Text>
          <Switch
            value={isAdmin}
            onValueChange={setIsAdmin}
            trackColor={{false: '#767577', true: '#81b0ff'}}
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Provider Access</Text>
          <Switch
            value={isProvider}
            onValueChange={setIsProvider}
            trackColor={{false: '#767577', true: '#81b0ff'}}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/(auth)/loginPage')}
          >
            <Text style={styles.linkText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
  headerIcon: {
    marginBottom: 16,
    alignSelf: 'center',
  },
});
