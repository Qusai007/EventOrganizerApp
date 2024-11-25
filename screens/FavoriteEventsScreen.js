import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { firestore, auth } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const FavoriteEventsScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = auth.currentUser.uid;
        const favQuery = query(
          collection(firestore, "events"),
          where("userId", "==", userId),
          where("isFavorite", "==", true)
        );
        const querySnapshot = await getDocs(favQuery);
        const favoriteEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoriteEvents);
      } catch (error) {
        console.error("Error fetching favorites:", error.message);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await deleteDoc(doc(firestore, "events", id));
      setFavorites((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorite events found.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove Favorite</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#dc3545",
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});

export default FavoriteEventsScreen;
