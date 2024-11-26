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

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to log out.");
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Events</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("AddEditEvent", { event: item })}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteEvent(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favButton}
              onPress={() => addToFavorites(item.id, item)}
            >
              <Text style={styles.buttonText}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddEditEvent")}
      >
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  logoutButton: {
    fontSize: 16,
    color: "#FFD700",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "#FF4136",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  favButton: {
    backgroundColor: "#2ECC40",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EventListScreen;
