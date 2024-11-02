import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
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
import { Text, TextClassContext } from '@/components/ui/text';

export default function SignUpPage() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const signUpWithEmail = async () => {
    setLoading(true);
    let validationErrors: { [key: string]: string } = {};

    if (!firstName) {
      validationErrors.firstName = 'First name is required';
    }
    if (!lastName) {
      validationErrors.lastName = 'Last name is required';
    }
    if (!email) {
      validationErrors.email = 'Email is required';
    }
    if (!password) {
      validationErrors.password = 'Password is required';
    }
    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      const user = data.user;

      if (error) {
        if (error.message.includes('Password should be at least 6 characters')) {
          setErrors({ password: 'Password should be at least 6 characters' });
        } else if (error.message.includes('Unable to validate email address')) {
          setErrors({ email: 'Unable to validate email address: invalid format' });
        } else {
          console.error('Signup error:', error);
          Alert.alert('Error', error.message);
        }
      } else if (user) {
        const { data: profileData, error: profileFetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileFetchError && profileFetchError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileFetchError);
          Alert.alert('Error', profileFetchError.message);
        } else if (profileData) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber,
            })
            .eq('id', user.id);

          if (profileUpdateError) {
            console.error('Profile update error:', profileUpdateError);
            Alert.alert('Error', profileUpdateError.message);
          } else {
            console.log('User signed up and profile updated');
            router.replace('/(tabs)/homePage');
          }
        } else {
          const { error: profileInsertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id, // Use the user ID from the auth table
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
              },
            ]);

          if (profileInsertError) {
            console.error('Profile creation error:', profileInsertError);
            Alert.alert('Error', profileInsertError.message);
          } else {
            console.log('User signed up and profile created');
            router.replace('/(tabs)/homePage');
          }
        }
      } else {
        console.error('User is null');
        Alert.alert('Error', 'User is null');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Signup failed', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
      <Card style={{ backgroundColor: colors.card }}>
        <TextClassContext.Provider value="text-lg text-foreground">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 4 }}>
              <Label nativeID="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <Text className="text-red-500">{errors.firstName}</Text>
              )}
            </View>
            <View style={{ gap: 4 }}>
              <Label nativeID="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <Text className="text-red-500">{errors.lastName}</Text>
              )}
            </View>
            <View style={{ gap: 4 }}>
              <Label nativeID="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
              />
              {errors.email && (
                <Text className="text-red-500">{errors.email}</Text>
              )}
            </View>
            <View style={{ gap: 4 }}>
              <Label nativeID="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password}</Text>
              )}
            </View>
            <View style={{ gap: 4 }}>
              <Label nativeID="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <Text className="text-red-500">{errors.phoneNumber}</Text>
              )}
            </View>
            <Button onPress={signUpWithEmail} disabled={loading}>
                {loading ? <Text>Signing Up...</Text> : <Text>Sign Up</Text>}
            </Button>
          </CardContent>
          <CardFooter>
            <Button onPress={() => router.push('/(auth)/loginPage')} disabled={loading}>
                <Text>Already have an account? Log in</Text>
            </Button>
          </CardFooter>
        </TextClassContext.Provider>
      </Card>
    </View>
  );
}