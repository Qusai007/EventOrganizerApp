import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase";

export default function AddEditEventScreen({ route, navigation }) {
  const [title, setTitle] = useState(route.params?.event?.title || "");
  const [date, setDate] = useState(route.params?.event?.date || "");

  const handleSave = async () => {
    try {
      await addDoc(collection(firestore, "events"), { title, date });
      navigation.goBack();
    } catch (error) {
      alert("Failed to save event.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add/Edit Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});
