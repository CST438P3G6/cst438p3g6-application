import {Stack} from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Provider Dashboard'}} />
      <Stack.Screen
        name="createBusiness"
        options={{title: 'Create Business'}}
      />
      <Stack.Screen
        name="editBusiness/[id]"
        options={{title: 'Edit Business'}}
      />
      <Stack.Screen name="services" options={{title: 'Services'}} />
    </Stack>
  );
}
