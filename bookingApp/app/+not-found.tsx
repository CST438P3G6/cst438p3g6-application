import { View, Text, TouchableOpacity } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => {/* Navigate to home screen */}} style={{
        marginTop: 15,
        paddingVertical: 15,
      }}>
        <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}
