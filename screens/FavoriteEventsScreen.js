import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase";

const FavoriteEventsScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const favoritesRef = collection(firestore, `users/${userId}/favorites`);
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const favoriteEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favoriteEvents);
    });

    return () => unsubscribe();
  }, []);

  const removeFavorite = async (eventId) => {
    try {
      const userId = auth.currentUser?.uid;
      const favoriteRef = doc(firestore, `users/${userId}/favorites`, eventId);
      await deleteDoc(favoriteRef);
      Alert.alert("Success", "Event removed from favorites!");
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert("Error", "Failed to remove the favorite.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <FlatList
        data={favorites}
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
              style={styles.removeButton}
              onPress={() => removeFavorite(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove Favorite</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorite events found.</Text>
        }
      />
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
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#CCC",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  removeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default FavoriteEventsScreen;
