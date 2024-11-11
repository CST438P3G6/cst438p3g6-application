import React, {useEffect} from 'react';
import {useRouter} from 'expo-router';
import {View, Alert, ActivityIndicator} from 'react-native';
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
import {useUser} from '@/context/UserContext';

const SettingsPage: React.FC = () => {
  const {user, profile, loading, signOut} = useUser();
  const navigation = useNavigation();
  const {isDarkColorScheme, setColorScheme} = useColorScheme();
  const {colors} = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem('supabase.auth.token');
      console.log('Logged out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'index'}],
        }),
      );
    } catch (error: any) {
      Alert.alert('Error logging out', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const {error} = await supabase.auth.admin.deleteUser(user?.id || '');
    // problem for later tbh
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

      if (error) throw error;
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

      if (error) throw error;
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
          {profile && (
            <>
              <Text>ID: {profile.id}</Text>
              <Text>
                Name: {profile.first_name} {profile.last_name}
              </Text>
              <Text>Email: {profile.email}</Text>
              <Text>Phone: {profile.phone_number}</Text>
              <Text>Admin: {profile.isadmin ? 'True' : 'False'}</Text>
              <Text>Provider: {profile.isprovider ? 'True' : 'False'}</Text>
              <Text>Status: {profile.is_active ? 'Active' : 'Inactive'}</Text>
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
              checked={profile?.isadmin || false}
              onCheckedChange={toggleAdminStatus}
            />
            <Text
              onPress={() => toggleAdminStatus(!profile?.isadmin)}
              className="ml-2"
            >
              Admin
            </Text>
          </View>

          <View className="flex-row items-center mt-5">
            <Switch
              checked={profile?.isprovider || false}
              onCheckedChange={toggleProviderStatus}
            />
            <Text
              onPress={() => toggleProviderStatus(!profile?.isprovider)}
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
