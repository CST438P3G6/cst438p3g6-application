// app/(tabs)/(settings)/_layout.tsx
import {Stack} from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="editProfile"
        options={{
          headerTitle: 'Edit Profile',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
