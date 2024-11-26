import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsRef = collection(firestore, "events");
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    });

    return () => unsubscribe();
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
      alert("Failed to add to favorites.");
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(firestore, "events", eventId);
      await deleteDoc(eventRef);
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
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
            <Text style={styles.date}>
              {item.date && item.date.seconds
                ? new Date(item.date.seconds * 1000).toDateString()
                : "No Date"}
            </Text>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddEditEvent")}
      >
        <Text style={styles.addButtonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#FFD700" },
  card: {
    backgroundColor: "#333",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#FFD700" },
  date: { fontSize: 14, color: "#FFF" },
  editButton: { color: "#00f", marginTop: 10 },
  deleteButton: { color: "#f00", marginTop: 5 },
  favButton: { color: "#0f0", marginTop: 5 },
  addButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: { color: "#1a1a2e", fontWeight: "bold", fontSize: 16 },
});

export default EventListScreen;
