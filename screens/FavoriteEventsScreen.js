import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firestore, auth } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function FavoriteEventsScreen() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const userFavoritesRef = collection(firestore, `users/${auth.currentUser?.uid}/favorites`);

    const unsubscribe = onSnapshot(userFavoritesRef, (snapshot) => {
      const fetchedFavorites = snapshot.docs.map((doc) => ({
        id: doc.id, // Ensure id is included
        ...doc.data(),
      }));
      setFavorites(fetchedFavorites);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  const handleRemoveFavorite = async (id) => {
    try {
      const favoriteRef = doc(firestore, `users/${auth.currentUser?.uid}/favorites`, id);
      await deleteDoc(favoriteRef); // Delete the document
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== id)); // Update UI
      Alert.alert('Success', 'Favorite removed successfully!');
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()} // Unique keys
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFavorite(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove Favorite</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
  },
  eventCard: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
