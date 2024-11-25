import React from 'react';
import { View, Text, Button } from 'react-native';

export default function EventListScreen({ navigation }) {
  return (
    <View>
      <Text>Event List</Text>
      <Button title="Add Event" onPress={() => navigation.navigate('AddEditEvent')} />
    </View>
  );
}
