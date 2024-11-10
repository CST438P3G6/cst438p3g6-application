// app/(tabs)/(settings)/editProfile.tsx
import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Text} from '@/components/ui/text';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {supabase} from '@/utils/supabase';
import {useRouter} from 'expo-router';

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        const {data: profile} = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone_number || '');
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone,
          })
          .eq('id', user.id);

        router.back();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View>
            <Label>First Name</Label>
            <Input value={firstName} onChangeText={setFirstName} />
          </View>
          <View>
            <Label>Last Name</Label>
            <Input value={lastName} onChangeText={setLastName} />
          </View>
          <View>
            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} />
          </View>
          <View>
            <Label>Phone</Label>
            <Input value={phone} onChangeText={setPhone} />
          </View>
          <Button onPress={handleSave}>
            <Text>Save Changes</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

export default EditProfile;
