import {Stack} from 'expo-router';
import {Home, User} from 'lucide-react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Provider Dashboard',
        }}
      />
      <Stack.Screen
        name="createBusiness"
        options={{
          headerTitle: 'Create Business',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
