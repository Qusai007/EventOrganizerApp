import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
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
      alert("Removed from favorites!");
    } catch (error) {
      console.error("Error removing favorite:", error);
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
            <Text style={styles.date}>{item.date}</Text>
            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
              <Text style={styles.removeButton}>Remove Favorite</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  card: { padding: 10, borderWidth: 1, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 16, color: "#555" },
  removeButton: { color: "red", marginTop: 5 },
});

export default FavoriteEventsScreen;
