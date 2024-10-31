import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
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
      navigation.navigate('index'); 
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
      navigation.navigate('index'); 
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
      {user ? (
        <Card>
          <Text className="mb-2 text-lg">Email: {user.email}</Text>
          <Text className="mb-2 text-lg">ID: {user.id}</Text>
          <Button variant="default" size="default" onPress={handleLogout}>
            <Text>Logout</Text>
          </Button>
          <Button variant="destructive" size="default" onPress={handleDeleteAccount}>
            <Text>Delete Account</Text>
          </Button>
        </Card>
      ) : (
        <Text style={{ color: colors.text }}>No user information available</Text>
      )}
    </View>
  );
};

export default SettingsPage;