import {View} from 'react-native';
import {Text} from '@/components/ui/text';
import {Button} from '@/components/ui/button';
import {useRouter} from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        This screen doesn't exist.
      </Text>
      <Text className="text-base text-gray-600 mb-6">
        This is the +not-found.tsx
      </Text>
      <Button
        className="bg-blue-500 px-4 py-2 rounded"
        onPress={() => router.push('/')}
      >
        <Text className="text-white">Go to home screen!</Text>
      </Button>
    </View>
  );
}
