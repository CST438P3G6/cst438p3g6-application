import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text'; 
import { Briefcase as BusinessIcon } from 'lucide-react-native';

function Business() {
  return (
    <View className='flex-1 justify-center'>
      <BusinessIcon />
      <Text>Business Page</Text>
    </View>
  );
}

export default Business;