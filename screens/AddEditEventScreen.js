import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { firestore } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const AddEditEventScreen = ({ route, navigation }) => {
  const { eventId, isEditing } = route.params || {};
  const [title, setTitle] = useState(route.params?.title || '');
  const [description, setDescription] = useState(route.params?.description || '');
  const [date, setDate] = useState(route.params?.date || new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const saveEvent = async () => {
    try {
      if (isEditing) {
        const eventDoc = doc(firestore, 'events', eventId);
        await updateDoc(eventDoc, { title, description, date: date.toISOString() });
      } else {
        const eventsRef = collection(firestore, 'events');
        await addDoc(eventsRef, { title, description, date: date.toISOString() });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEditing ? 'Edit Event' : 'Add Event'}</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text onPress={showDatePicker} style={styles.dateText}>
        {date.toDateString()}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Button title="Save" onPress={saveEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, marginBottom: 8, padding: 8, borderRadius: 4 },
  dateText: { fontSize: 16, color: 'blue', marginBottom: 8 },
});

export default AddEditEventScreen;
