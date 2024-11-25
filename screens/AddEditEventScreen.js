import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebase';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';

export default function AddEditEventScreen({ route, navigation }) {
  const { event, eventId } = route.params || {};
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date || '');

  const handleSave = async () => {
    if (eventId) {
      // Update existing event
      const eventRef = doc(firestore, 'events', eventId);
      await updateDoc(eventRef, { title, description, date });
    } else {
      // Add new event
      const eventsRef = collection(firestore, 'events');
      await addDoc(eventsRef, {
        title,
        description,
        date,
        createdBy: auth.currentUser?.uid,
      });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
});
