import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Main');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
