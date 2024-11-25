import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { firestore, auth } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function FavoriteEventsScreen() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const userFavoritesRef = collection(firestore, `users/${auth.currentUser?.uid}/favorites`);

    const unsubscribe = onSnapshot(userFavoritesRef, (snapshot) => {
      const fetchedFavorites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(fetchedFavorites);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  const handleRemoveFavorite = async (id) => {
    const favoriteRef = doc(firestore, `users/${auth.currentUser?.uid}/favorites`, id);
    await deleteDoc(favoriteRef);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Button title="Remove Favorite" onPress={() => handleRemoveFavorite(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
