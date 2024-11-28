import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Real-time updates for the "events" collection
    const eventsRef = collection(firestore, "events");
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const addToFavorites = async (eventId, event) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "You need to log in to add favorites.");
        return;
      }

      const favoritesRef = doc(collection(firestore, `users/${userId}/favorites`), eventId);
      await setDoc(favoritesRef, event);
      Alert.alert("Success", "Event added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert("Error", "Failed to add to favorites.");
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(firestore, "events", eventId);
      await deleteDoc(eventRef);
      Alert.alert("Success", "Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", "Failed to delete event.");
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => auth.signOut()}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: "#FF4500", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
                {item.date && item.date.seconds
                ? new Date(item.date.seconds * 1000).toDateString() // Firestore Timestamp
                : item.date
                ? new Date(item.date).toDateString() // String date
                : "Invalid Date"}
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
        ListEmptyComponent={<Text style={styles.emptyText}>No events available.</Text>}
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
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  date: { fontSize: 16, color: "#555" },
  editButton: { color: "#1E90FF", marginTop: 10 },
  deleteButton: { color: "#FF4500", marginTop: 10 },
  favButton: { color: "#32CD32", marginTop: 10 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
  addButton: {
    backgroundColor: "#FF4500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default EventListScreen;
