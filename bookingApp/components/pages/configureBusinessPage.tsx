import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text'; 
import { Settings as ConfigureBusinessIcon } from 'lucide-react-native';

function ConfigureBusiness() {
  return (
    <View className='flex-1 justify-center'>
      <ConfigureBusinessIcon />
      <Text>Configure Business Page</Text>
    </View>
  );
}

export default ConfigureBusiness;