import React, { useEffect, useState } from 'react';
import { View, Alert, Switch } from 'react-native';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme'; 
import { useTheme } from '@react-navigation/native'; 
import { Text, TextClassContext } from '@/components/ui/text'; 

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const { colors } = useTheme(); 

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error logging out', error.message);
    } else {
      await AsyncStorage.removeItem('supabase.auth.token');
      console.log('Logged out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'index' }],
        })
      );
    }
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
    if (error) {
      Alert.alert('Error deleting account', error.message);
    } else {
      await AsyncStorage.removeItem('supabase.auth.token');
      Alert.alert('Account deleted successfully');
      console.log('Account deleted successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'index' }],
        })
      );
    }
  };

  const toggleTheme = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setColorScheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  if (loading) {
    return <Text style={{ color: colors.text }}>Loading...</Text>;
  }

  return (
    <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
      {user ? (
        <Card style={{ backgroundColor: colors.card }}>
          <TextClassContext.Provider value="text-lg text-foreground">
            <Text className="mb-2">Email: {user.email}</Text>
            <Text className="mb-2">ID: {user.id}</Text>
            <Button variant="default" size="default" onPress={handleLogout}>
              <Text>Logout</Text>
            </Button>
            <Button variant="destructive" size="default" onPress={handleDeleteAccount}>
              <Text>Delete Account</Text>
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ marginRight: 10 }}>Dark Theme</Text>
              <Switch
                value={isDarkColorScheme}
                onValueChange={toggleTheme}
              />
            </View>
          </TextClassContext.Provider>
        </Card>
      ) : (
        <Text style={{ color: colors.text }}>No user information available</Text>
      )}
    </View>
  );
};

export default SettingsPage;