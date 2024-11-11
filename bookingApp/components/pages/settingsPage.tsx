import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {View, Alert, ActivityIndicator} from 'react-native';
import {User} from '@supabase/supabase-js';
import {supabase} from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useColorScheme} from '~/lib/useColorScheme';
import {useTheme} from '@react-navigation/native';
import {Text} from '@/components/ui/text';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {useLoggedInUserProfile} from '@/hooks/useLoggedInUserProfile';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const {isDarkColorScheme, setColorScheme} = useColorScheme();
  const {colors} = useTheme();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

  // Get refetchProfile from the hook
  const {profile: data, error, refetchProfile} = useLoggedInUserProfile();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: {user},
        error,
      } = await supabase.auth.getUser();
      if (error) {
        Alert.alert('Error fetching user data', error.message);
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (data) {
      setIsAdmin(data.isadmin);
      setIsProvider(data.isprovider);
    }
  }, [data]);

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error logging out', error.message);
    } else {
      await AsyncStorage.removeItem('supabase.auth.token');
      console.log('Logged out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'index'}],
          // root of the app checks for user login status
        }),
      );
    }
  };

  const handleDeleteAccount = async () => {
    const {error} = await supabase.auth.admin.deleteUser(user?.id || '');
    // Don't implement this just yet
  };

  const toggleTheme = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setColorScheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const toggleAdminStatus = async (value: boolean) => {
    if (!user) return;

    try {
      const {error} = await supabase
        .from('profiles')
        .update({isadmin: value})
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refetch profile data to refresh the page
      await refetchProfile();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      Alert.alert('Error updating admin status', error.message);
    }
  };

  const toggleProviderStatus = async (value: boolean) => {
    if (!user) return;

    try {
      const {error} = await supabase
        .from('profiles')
        .update({isprovider: value})
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refetch profile data to refresh the page
      await refetchProfile();
    } catch (error: any) {
      console.error('Error updating provider status:', error);
      Alert.alert('Error updating provider status', error.message);
    }
  };

  const handleEditProfileChange = () => {
    router.push('/settings/editProfile');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Card>
        <CardHeader>
          <Text>User Information</Text>
        </CardHeader>
        <CardContent>
          {data && (
            <>
              <Text>ID: {data.id}</Text>
              <Text>
                Name: {data.first_name} {data.last_name}
              </Text>
              <Text>Email: {data.email}</Text>
              <Text>Phone: {data.phone_number}</Text>
              <Text>Admin: {data.isadmin ? 'True' : 'False'}</Text>
              <Text>Provider: {data.isprovider ? 'True' : 'False'}</Text>
              <Text>Status: {data.is_active ? 'Active' : 'Inactive'}</Text>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="flex justify-center mt-5">
        <CardContent>
          <Button variant="default" size="default" onPress={handleLogout}>
            <Text>Logout</Text>
          </Button>

          <Button
            variant="default"
            size="default"
            onPress={handleEditProfileChange}
            className="mt-2"
          >
            <Text>Edit Profile</Text>
          </Button>

          <Button
            variant="destructive"
            size="default"
            onPress={handleDeleteAccount}
            className="mt-2"
          >
            <Text>Delete Account</Text>
          </Button>

          <View className="flex-row items-center mt-5">
            <Switch
              checked={isDarkColorScheme}
              onCheckedChange={toggleTheme}
              nativeID="dark-theme"
            />
            <Label
              nativeID="dark-theme"
              onPress={() => {
                toggleTheme(!isDarkColorScheme);
              }}
              className="ml-2"
            >
              Dark Theme
            </Label>
          </View>

          <View className="flex-row items-center mt-5">
            <Switch
              checked={isAdmin}
              onCheckedChange={(value) => toggleAdminStatus(value)}
            />
            <Text onPress={() => toggleAdminStatus(!isAdmin)} className="ml-2">
              Admin
            </Text>
          </View>

          <View className="flex-row items-center mt-5">
            <Switch
              checked={isProvider}
              onCheckedChange={(value) => toggleProviderStatus(value)}
            />
            <Text
              onPress={() => toggleProviderStatus(!isProvider)}
              className="ml-2"
            >
              Provider
            </Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default SettingsPage;
