import {View, Text, TouchableOpacity} from 'react-native';
import {Link} from 'expo-router';

// business page

const businesses = [
  {id: '1', name: 'Business One'},
  {id: '2', name: 'Business Two'},
  {id: '3', name: 'Business Three'},
];

export default function BusinessPage() {
  return (
    <View>
      <Text>Business Page</Text>
      {businesses.map((business) => (
        <Link href={`/${business.id}`} key={business.id} asChild>
          <TouchableOpacity>
            <Text>{business.name}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}
