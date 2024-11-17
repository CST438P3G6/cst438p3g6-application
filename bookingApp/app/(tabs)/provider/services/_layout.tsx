import {Stack} from 'expo-router';

export default function ServiceLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="[id]" options={{title: 'Services'}} />
      <Stack.Screen
        name="createService/[businessId]"
        options={{
          title: 'Create Service',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="edit/[id]" options={{title: 'Edit Service'}} />
    </Stack>
  );
}
