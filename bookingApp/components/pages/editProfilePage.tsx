import React from 'react';
import {View, ActivityIndicator, Alert} from 'react-native';
import useEditProfile from '@/hooks/useEditProfile';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Text} from '@/components/ui/text';
import {Switch} from '@/components/ui/switch';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {router} from 'expo-router';

const EditProfileForm: React.FC = () => {
  const {
    loading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    isProvider,
    setIsProvider,
    handleUpdateProfile,
  } = useEditProfile();

  const updateProfile = async () => {
    await handleUpdateProfile();
    router.push('/settingsPage');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />
          </View>

          <View className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
            />
          </View>

          <View className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
          </View>

          <View className="flex-row items-center space-x-2">
            <Switch checked={isProvider} onCheckedChange={setIsProvider} />
            <Label>Provider Account</Label>
          </View>

          <Button onPress={updateProfile} className="mt-4">
            <Text className="text-white">Update Profile</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

export default EditProfileForm;
