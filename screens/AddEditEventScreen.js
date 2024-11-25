import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from '../firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import DatePicker from 'react-native-date-picker';

export default function AddEditEventScreen({ route, navigation }) {
  const { event, eventId } = route.params || {};
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date ? new Date(event.date) : new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleSave = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const eventData = {
      title,
      description,
      date: date.toISOString().split('T')[0],
      createdBy: auth.currentUser?.uid,
    };

    try {
      if (eventId) {
        const eventRef = doc(firestore, 'events', eventId);
        await setDoc(eventRef, eventData, { merge: true });
      } else {
        const eventsRef = collection(firestore, 'events');
        await addDoc(eventsRef, eventData);
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
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.dateInput} onPress={() => setDatePickerVisible(true)}>
        <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isDatePickerVisible}
        date={date}
        onConfirm={(selectedDate) => {
          setDatePickerVisible(false);
          setDate(selectedDate);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
