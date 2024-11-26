import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firestore } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

const AddEditEventScreen = ({ route, navigation }) => {
  const event = route.params?.event || {};
  const isEditing = !!route.params?.event;

  const [title, setTitle] = useState(event.title || "");
  const [date, setDate] = useState(event.date || new Date().toISOString());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate.toISOString());
    hideDatePicker();
  };

  const saveEvent = async () => {
    try {
      if (isEditing) {
        const eventRef = doc(firestore, "events", event.id);
        await updateDoc(eventRef, { title, date });
        alert("Event updated!");
      } else {
        const eventsRef = collection(firestore, "events");
        await addDoc(eventsRef, { title, date });
        alert("Event added!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEditing ? "Edit Event" : "Add Event"}</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={styles.input}
      />
      <Button title="Pick Date" onPress={showDatePicker} />
      <Text style={styles.dateText}>{new Date(date).toDateString()}</Text>
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
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  dateText: { fontSize: 16, marginVertical: 10 },
});

export default AddEditEventScreen;
