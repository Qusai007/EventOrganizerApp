import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
            </View>
            {item.createdBy === auth.currentUser?.uid && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('AddEditEvent', { event: item, eventId: item.id })
                }
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
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
