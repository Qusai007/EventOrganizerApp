import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from '../firebase';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';

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
        const eventsRef = collection(firestore, 'events');
        await addDoc(eventsRef, {
          title,
          description,
          date,
          createdBy: auth.currentUser?.uid,
        });
      }
      Alert.alert('Success', 'Event saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{eventId ? 'Edit Event' : 'Add Event'}</Text>
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
        placeholder="Date (YYYY-MM-DD)"
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});
