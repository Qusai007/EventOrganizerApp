import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

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

  const handleDelete = async (eventId) => {
    const eventRef = doc(firestore, 'events', eventId);
    await deleteDoc(eventRef);
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
              title="Edit"
              onPress={() =>
                navigation.navigate('AddEditEvent', { event: item, eventId: item.id })
              }
            />
            {item.createdBy === auth.currentUser?.uid && (
              <Button title="Delete" onPress={() => handleDelete(item.id)} />
            )}
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditEvent')}
      >
        <Text style={styles.addButtonText}>Add Event</Text>
      </TouchableOpacity>
      <Button title="Log Out" onPress={() => auth.signOut()} />
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
