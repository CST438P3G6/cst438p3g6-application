import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text'; 
import { Calendar as AppointmentsIcon } from 'lucide-react-native';

function Appointments() {
  return (
    <View className='flex-1 justify-center'>
      <AppointmentsIcon />
      <Text>Appointments Page</Text>
    </View>
  );
}

export default Appointments;