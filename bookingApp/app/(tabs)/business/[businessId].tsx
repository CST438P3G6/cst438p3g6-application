import {View, Text, Button} from 'react-native';
import {useRouter, useSearchParams} from 'expo-router';

export default function BusinessDetails() {
  const {businessid} = useSearchParams();
  const router = useRouter();

  return (
    <View>
      <Text>Business Details for ID: {businessid}</Text>
      <Button
        title="Schedule Appointment"
        onPress={() => {
          // Handle appointment scheduling
        }}
      />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}
