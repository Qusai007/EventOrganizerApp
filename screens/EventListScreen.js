import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetchedEvents);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  const handleAddToFavorites = async (event) => {
    try {
      const favoritesRef = collection(firestore, `users/${auth.currentUser?.uid}/favorites`);
      await addDoc(favoritesRef, event);
      Alert.alert('Success', 'Event added to favorites!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.date}</Text>
            <Button
              title="Favorite"
              onPress={() => handleAddToFavorites(item)}
            />
            <Button
              title="Edit"
              onPress={() => navigation.navigate('AddEditEvent', { event: item, eventId: item.id })}
            />
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditEvent')}
      >
        <Text style={styles.addButtonText}>Add Event</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
