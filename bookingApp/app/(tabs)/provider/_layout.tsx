import {Stack} from 'expo-router';
import {Presentation} from 'lucide-react-native';

export default function Layout() {
  return (
    <Stack screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="index"
        options={{title: 'Provider Dashboard', headerShown: true}}
      />
      <Stack.Screen
        name="createBusiness"
        options={{title: 'Create Business'}}
      />
      <Stack.Screen
        name="editBusiness/[id]"
        options={{title: 'Edit Business'}}
      />
      <Stack.Screen name="services/index" options={{title: 'Services'}} />
      <Stack.Screen
        name="services/[id]"
        options={{title: 'Service Details', presentation: 'modal'}}
      />
      <Stack.Screen
        name="services/createService/[businessId]"
        options={{title: 'Create Service', presentation: 'modal'}}
      />
      <Stack.Screen
        name="services/viewService/[id]"
        options={{title: 'View Service', presentation: 'modal'}}
      />
      <Stack.Screen
        name="services/edit/[id]"
        options={{title: 'Edit Service', presentation: 'modal'}}
      />
    </Stack>
  );
}
