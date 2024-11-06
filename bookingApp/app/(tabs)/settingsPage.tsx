import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {User} from '@supabase/supabase-js';
import {supabase} from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useColorScheme} from '~/lib/useColorScheme';
import {useTheme} from '@react-navigation/native';
import {Text} from '@/components/ui/text';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const {isDarkColorScheme, setColorScheme} = useColorScheme();
  const {colors} = useTheme();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

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
        }),
      );
    }
  };

  const handleDeleteAccount = async () => {
    const {error} = await supabase.auth.admin.deleteUser(user?.id || '');
    if (error) {
      Alert.alert('Error deleting account', error.message);
    } else {
      await AsyncStorage.removeItem('supabase.auth.token');
      Alert.alert('Account deleted successfully');
      console.log('Account deleted successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'index'}],
        }),
      );
    }
  };

  const toggleTheme = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setColorScheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const handleAdminChange = () => {
    // Placeholder function
    setIsAdmin(!isAdmin);
  };

  const handleProviderChange = () => {
    // Placeholder function
    setIsProvider(!isProvider);
  };

  if (loading) {
    return <Text style={{color: colors.text}}>Loading...</Text>;
  }

  return (
    <View className="flex-1 justify-center items-center p-5">
      {user ? (
        <Card style={{backgroundColor: colors.card}}>
          <CardContent>
            <Text className="mb-2 text-lg" style={{color: colors.text}}>
              Email: {user.email}
            </Text>
            <Text className="mb-2 text-lg" style={{color: colors.text}}>
              ID: {user.id}
            </Text>
            <Button variant="default" size="default" onPress={handleLogout}>
              <Text>Logout</Text>
            </Button>
            <Button
              variant="destructive"
              size="default"
              onPress={handleDeleteAccount}
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
              >
                Dark Theme
              </Label>
            </View>
            <View className="flex-row items-center mt-5">
              <Switch
                checked={isAdmin}
                onCheckedChange={handleAdminChange}
                nativeID="admin-switch"
              />
              <Label nativeID="admin-switch" onPress={handleAdminChange}>
                Admin
              </Label>
            </View>
            <View className="flex-row items-center mt-5">
              <Switch
                checked={isProvider}
                onCheckedChange={handleProviderChange}
                nativeID="provider-switch"
              />
              <Label nativeID="provider-switch" onPress={handleProviderChange}>
                Provider
              </Label>
            </View>
          </CardContent>
        </Card>
      ) : (
        <Text>No user information available</Text>
      )}
    </View>
  );
};

export default SettingsPage;
