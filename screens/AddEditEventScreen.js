import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firestore } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";

const AddEditEventScreen = ({ route, navigation }) => {
  const { eventId, isEditing } = route.params || {};
  const [title, setTitle] = useState(route.params?.title || "");
  const [description, setDescription] = useState(route.params?.description || "");
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
        await updateDoc(doc(firestore, "events", eventId), {
          title,
          description,
          date: date.toISOString(),
        });
      } else {
        await addDoc(collection(firestore, "events"), {
          title,
          description,
          date: date.toISOString(),
          userId: auth.currentUser.uid,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving event:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEditing ? "Edit Event" : "Add Event"}</Text>
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
      <Button title="Pick Date" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={styles.dateText}>Selected Date: {date.toDateString()}</Text>
      <Button title="Save" onPress={saveEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AddEditEventScreen;
