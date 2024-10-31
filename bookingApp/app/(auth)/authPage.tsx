import * as React from 'react';
import { View, Alert, AppState, AppStateStatus } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { useTheme } from '@react-navigation/native';

export default function AuthTabsScreen() {
    const { colors } = useTheme();
  const [value, setValue] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      console.log('User logged in');
      router.replace('/(tabs)/homePage');
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      console.log('User signed up');
      router.replace('/(tabs)/homePage');
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 ,backgroundColor: colors.background}}>
      <Tabs
        value={value}
        onValueChange={setValue}
        style={{ width: '100%', maxWidth: 400, marginHorizontal: 'auto', flexDirection: 'column', gap: 6 }}
      >
        <TabsList style={{ flexDirection: 'row', width: '100%' }}>
          <TabsTrigger value='login' style={{ flex: 1 }}>
            <Text>Login</Text>
          </TabsTrigger>
          <TabsTrigger value='signup' style={{ flex: 1 }}>
            <Text>Sign Up</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='login'>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Sign in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ gap: 16 }}>
              <View style={{ gap: 4 }}>
                <Label nativeID='email'>Email</Label>
                <Input
                  id='email'
                  value={email}
                  onChangeText={setEmail}
                  placeholder='Enter your email'
                />
              </View>
              <View style={{ gap: 4 }}>
                <Label nativeID='password'>Password</Label>
                <Input
                  id='password'
                  value={password}
                  onChangeText={setPassword}
                  placeholder='Enter your password'
                  secureTextEntry
                />
              </View>
            </CardContent>
            <CardFooter>
              <Button onPress={signInWithEmail} disabled={loading}>
                <Text>{loading ? 'Signing in...' : 'Sign In'}</Text>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='signup'>
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ gap: 16 }}>
              <View style={{ gap: 4 }}>
                <Label nativeID='email'>Email</Label>
                <Input
                  id='email'
                  value={email}
                  onChangeText={setEmail}
                  placeholder='Enter your email'
                />
              </View>
              <View style={{ gap: 4 }}>
                <Label nativeID='password'>Password</Label>
                <Input
                  id='password'
                  value={password}
                  onChangeText={setPassword}
                  placeholder='Enter your password'
                  secureTextEntry
                />
              </View>
            </CardContent>
            <CardFooter>
              <Button onPress={signUpWithEmail} disabled={loading}>
                <Text>{loading ? 'Signing up...' : 'Sign Up'}</Text>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </View>
  );
}