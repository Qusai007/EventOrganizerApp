import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
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

      const favoritesRef = doc(
        collection(firestore, `users/${userId}/favorites`),
        eventId
      );
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
            <Text style={styles.date}>
              {item.date ? new Date(item.date).toDateString() : "Invalid Date"}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("AddEditEvent", { event: item })
              }
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
              onPress={() => deleteEvent(item.id)}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#34C759" }]}
              onPress={() => addToFavorites(item.id, item)}
            >
              <Text style={styles.actionText}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addEventButton}
        onPress={() => navigation.navigate("AddEditEvent")}
      >
        <Text style={styles.addEventButtonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1c1c1e",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addEventButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addEventButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EventListScreen;
