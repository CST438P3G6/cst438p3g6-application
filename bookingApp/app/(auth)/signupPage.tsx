import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {useRouter} from 'expo-router';
import {supabase} from '@/utils/supabase';
import Toast from 'react-native-toast-message';
import {UserPlus, Mail, Lock, User, Phone} from 'lucide-react-native';
import Logo from '@/components/common/logo';

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

  const validateInputs = () => {
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields',
        position: 'bottom',
        visibilityTime: 1000,
      });
      return false;
    }
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Error',
        text2: 'Password must be at least 6 characters long',
        position: 'bottom',
        visibilityTime: 1000,
      });
      return false;
    }
    return true;
  };

  const signUpWithEmail = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const {
        data: {user},
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('User creation failed');

      const {error: profileError} = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          isadmin: isAdmin,
          isprovider: isProvider,
          is_active: true,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2:
          'Account created successfully! Please check your email to verify your account.',
        position: 'bottom',
        visibilityTime: 1000,
        onHide: () => router.push('/(auth)/loginPage'),
      });
    } catch (error) {
      console.error('SignUp error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as Error).message,
        position: 'bottom',
        visibilityTime: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ios: 20, android: 20, web: 0})}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Logo />
          <View style={styles.header}>
            <UserPlus size={32} color="#1E90FF" style={styles.headerIcon} />
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.description}>Create your account</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#1E90FF" />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={20} color="#1E90FF" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <User size={20} color="#1E90FF" />
              <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <User size={20} color="#1E90FF" />
              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Phone size={20} color="#1E90FF" />
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Admin Access</Text>
            <Switch
              value={isAdmin}
              onValueChange={setIsAdmin}
              trackColor={{false: '#767577', true: '#1E90FF'}}
            />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Provider Access</Text>
            <Switch
              value={isProvider}
              onValueChange={setIsProvider}
              trackColor={{false: '#767577', true: '#1E90FF'}}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
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
              disabled={loading}
            >
              <Text style={styles.linkText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1E90FF',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    marginTop: 24,
    gap: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#1E90FF',
    fontSize: 14,
  },
});
