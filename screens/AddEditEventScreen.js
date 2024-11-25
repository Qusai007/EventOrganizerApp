import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { firestore } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function AddEditEventScreen({ route, navigation }) {
  const { event, eventId } = route.params || {};
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date || '');

  const handleSave = async () => {
    try {
      if (eventId) {
        // Update existing event
        const eventRef = doc(firestore, 'events', eventId);
        await updateDoc(eventRef, { title, description, date });
      } else {
        // Add new event
        const eventsCollection = collection(firestore, 'events');
        await addDoc(eventsCollection, { title, description, date, createdBy: 'user_uid_here' }); // Replace with auth.uid
      }
      navigation.goBack();
    } catch (error) {
      alert('Error saving event: ' + error.message);
    }
  };

  return (
    <View>
      <Text>{eventId ? 'Edit Event' : 'Add Event'}</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput placeholder="Date" value={date} onChangeText={setDate} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}
