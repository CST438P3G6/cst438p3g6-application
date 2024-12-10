import React from 'react';
import {View, Text} from 'react-native';
import {Settings as ConfigureBusinessIcon} from 'lucide-react-native';

function ConfigureBusiness() {
  return (
    <View className="flex-1 justify-center">
      <ConfigureBusinessIcon />
      <Text>Configure Business Page</Text>
    </View>
  );
}

export default ConfigureBusiness;
