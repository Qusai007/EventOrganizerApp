import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';

const FavoriteEventsScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites from Firestore
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesSnapshot = await getDocs(collection(firestore, 'favorites'));
        const favoritesData = favoritesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', 'Failed to fetch favorites. Please check your network or permissions.');
      }
    };

    fetchFavorites();
  }, []);

  // Remove favorite from Firestore
  const removeFavorite = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'favorites', id));
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== id));
      Alert.alert('Success', 'Event removed from favorites.');
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove the event. Please try again later.');
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text>{item.date}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove Favorite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
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
    padding: 16,
  },
  favoriteCard: {
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default FavoriteEventsScreen;
