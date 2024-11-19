import React from 'react';
import {useRouter} from 'expo-router';
import {
  View,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {supabase} from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useTheme} from '@react-navigation/native';
import {useUser} from '@/context/UserContext';
import Toast from 'react-native-toast-message';
import {LogOut, User, UserCog} from 'lucide-react-native';

const SettingsPage: React.FC = () => {
  const {user, profile, loading, signOut} = useUser();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem('supabase.auth.token');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully',
        position: 'bottom',
        visibilityTime: 1000,
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'index'}],
        }),
      );
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to log out',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  };

  const toggleAdminStatus = async (value: boolean) => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not found',
        position: 'bottom',
        visibilityTime: 1000,
      });
      return;
    }
    try {
      const {error} = await supabase
        .from('profiles')
        .update({isadmin: value})
        .eq('id', user.id);

      if (error) throw error;
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Admin status updated successfully',
        position: 'bottom',
        visibilityTime: 1000,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update admin status',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  };

  const toggleProviderStatus = async (value: boolean) => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not found',
        position: 'bottom',
        visibilityTime: 4000,
      });
      return;
    }

    try {
      const {error} = await supabase
        .from('profiles')
        .update({isprovider: value})
        .eq('id', user.id);

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Provider status updated successfully',
        position: 'bottom',
        visibilityTime: 4000,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update provider status',
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={24} color={colors.text} />
            <Text style={styles.cardTitle}>User Information</Text>
          </View>
          {profile && (
            <View style={styles.profileInfo}>
              <Text style={styles.infoText}>ID: {profile.id}</Text>
              <Text style={styles.infoText}>
                Name: {profile.first_name} {profile.last_name}
              </Text>
              <Text style={styles.infoText}>Email: {profile.email}</Text>
              <Text style={styles.infoText}>Phone: {profile.phone_number}</Text>

              <View style={styles.switchContainer}>
                <Text style={styles.infoText}>Admin</Text>
                <Switch
                  value={profile.isadmin}
                  onValueChange={toggleAdminStatus}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.infoText}>Provider</Text>
                <Switch
                  value={profile.isprovider}
                  onValueChange={toggleProviderStatus}
                />
              </View>

              <Text style={styles.infoText}>
                Status: {profile.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={() => router.push('/settings/editProfile')}
        >
          <UserCog size={20} color="white" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#dc2626'}]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="white" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileInfo: {
    gap: 8,
  },
  infoText: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsPage;
