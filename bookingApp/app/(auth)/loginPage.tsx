import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useRouter} from 'expo-router';
import {supabase} from '@/utils/supabase';
import {Button} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Text} from '@/components/ui/text';

export default function LoginPage() {
  const {colors} = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInWithEmail = async () => {
    setLoading(true);
    try {
      const {error} = await supabase.auth.signInWithPassword({email, password});
      if (error) {
        Alert.alert('Error', (error as Error).message);
      } else {
        console.log('User logged in');
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: colors.background,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent style={{gap: 16}}>
          <View style={{gap: 4}}>
            <Label nativeID="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
          </View>
          <View style={{gap: 4}}>
            <Label nativeID="password">Password</Label>
            <Input
              id="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>
        </CardContent>
        <CardFooter>
          <Button onPress={signInWithEmail} disabled={loading}>
            <Text>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </Button>
          <Button
            onPress={() => router.push('/(auth)/signupPage')}
            disabled={loading}
          >
            <Text>Don't have an account? Sign Up</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
