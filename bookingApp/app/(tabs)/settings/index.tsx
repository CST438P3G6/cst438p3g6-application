import React, {useEffect} from 'react';
import {useRouter} from 'expo-router';
import {
  View,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {supabase} from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useTheme} from '@react-navigation/native';
import {useUser} from '@/context/UserContext';
import {LogOut, User, Trash2, Moon, Shield, UserCog} from 'lucide-react-native';

const SettingsPage: React.FC = () => {
  const {user, profile, loading, signOut} = useUser();
  const navigation = useNavigation();
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
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <ScrollView style={{flex: 1}}>
      <View style={{padding: 20}}>
        {/* User Info Card */}
        <View
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>
            User Information
          </Text>
          {profile && (
            <View>
              <Text>ID: {profile.id}</Text>
              <Text>
                Name: {profile.first_name} {profile.last_name}
              </Text>
              <Text>Email: {profile.email}</Text>
              <Text>Phone: {profile.phone_number}</Text>
              <Text>Admin: {profile.isadmin ? 'True' : 'False'}</Text>
              <Switch
                value={profile.isadmin}
                onValueChange={toggleAdminStatus}
              />
              <Text>Provider: {profile.isprovider ? 'True' : 'False'}</Text>
              <Switch
                value={profile.isprovider}
                onValueChange={toggleProviderStatus}
              />
              <Text>Status: {profile.is_active ? 'Active' : 'Inactive'}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={handleEditProfileChange}
        >
          <Text style={{color: 'white'}}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsPage;
