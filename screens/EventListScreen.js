import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(firestore, "events"));
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text>{item.title}</Text>
            <Button
              title="Edit"
              onPress={() => navigation.navigate("AddEditEvent", { event: item })}
            />
          </View>
        )}
      />
      <Button title="Add Event" onPress={() => navigation.navigate("AddEditEvent")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: "center" },
  eventCard: { padding: 10, marginVertical: 10, borderWidth: 1 },
});
