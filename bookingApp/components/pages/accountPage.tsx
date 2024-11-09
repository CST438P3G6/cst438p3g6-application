import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text'; 
import { User as AccountIcon } from 'lucide-react-native';

function Account() {
  return (
    <View className='flex-1 justify-center'>
      <AccountIcon />
      <Text>Account Page</Text>
    </View>
  );
}

export default Account;