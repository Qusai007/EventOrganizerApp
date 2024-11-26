import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(firestore, "events");
      const snapshot = await getDocs(eventsRef);
      const eventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  const addToFavorites = async (eventId, event) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("You need to log in to add favorites.");
        return;
      }

      const favoritesRef = doc(collection(firestore, `users/${userId}/favorites`), eventId);
      await setDoc(favoritesRef, event);
      alert("Added to Favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(firestore, "events", eventId);
      await deleteDoc(eventRef);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddEditEvent", { event: item })}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteEvent(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addToFavorites(item.id, item)}>
              <Text style={styles.favButton}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Add Event" onPress={() => navigation.navigate("AddEditEvent")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  card: { padding: 10, borderWidth: 1, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 16, color: "#555" },
  editButton: { color: "blue", marginTop: 5 },
  deleteButton: { color: "red", marginTop: 5 },
  favButton: { color: "green", marginTop: 5 },
});

export default EventListScreen;
