import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/FastBookerLogoOnly.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>FastBooker</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10, // Add some space between the image and the text
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Logo;
