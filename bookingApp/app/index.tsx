import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useUser} from '@/context/UserContext';
import {useRouter} from 'expo-router';
import {Text} from '@/components/ui/text';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Index() {
  // this should ideally be a loading spinner that is a splashscreen that routes to the correct page.
  // the problem is UserContext already does this so this is a bit spaghetti but the we dont actually have a '/' page
  const {user, profile, loading} = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/(auth)/loginPage');
      return;
    }

    if (!profile) {
      router.replace('/(auth)/loginPage');
      return;
    }

    if (user) {
      router.replace('/home');
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <Text>Redirecting...</Text>
      </View>
    </SafeAreaView>
  );
}
