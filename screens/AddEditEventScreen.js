import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firestore, auth } from "../firebase"; // Added auth import
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
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("You must be logged in to add events.");
        return;
      }

      if (!title.trim()) {
        alert("Please provide a title for the event.");
        return;
      }
      if (!date) {
        alert("Please select a date for the event.");
        return;
      }

      const eventsRef = collection(firestore, `users/${userId}/events`);

      if (isEditing) {
        const eventRef = doc(eventsRef, event.id);
        await updateDoc(eventRef, { title, date });
        alert("Event updated!");
      } else {
        await addDoc(eventsRef, { title, date });
        alert("Event added!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEditing ? "Edit Event" : "Add Event"}</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter Event Title"
        style={styles.input}
      />
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>
          {date ? new Date(date).toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveEvent}>
        <Text style={styles.saveButtonText}>Save Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: "#FF4500",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddEditEventScreen;
