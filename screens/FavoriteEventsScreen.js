import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const FavoriteEventsScreen = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const favoritesRef = collection(firestore, 'favorites');
      const querySnapshot = await getDocs(favoritesRef);
      const favoriteData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favoriteData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const favoriteDoc = doc(firestore, 'favorites', id);
      await deleteDoc(favoriteDoc);
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Button title="Remove Favorite" onPress={() => removeFavorite(item.id)} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default FavoriteEventsScreen;
