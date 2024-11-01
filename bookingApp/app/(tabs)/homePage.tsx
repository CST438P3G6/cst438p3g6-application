import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text'; 
import { Home as HomeIcon } from 'lucide-react-native';

function Home() {
  return (
    <View className='flex-1 justify-center'>
      <HomeIcon />
      <Text>Welcome to the Home Page</Text>
    </View>
  );
}

export default Home;