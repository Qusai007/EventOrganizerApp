import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(firestore, 'events');
      const querySnapshot = await getDocs(eventsRef);
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const eventDoc = doc(firestore, 'events', id);
      await deleteDoc(eventDoc);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{new Date(item.date).toDateString()}</Text>
            <Button
              title="Edit"
              onPress={() => navigation.navigate('AddEditEvent', { ...item, isEditing: true })}
            />
            <Button title="Delete" onPress={() => deleteEvent(item.id)} />
          </View>
        )}
      />
      <Button title="Add Event" onPress={() => navigation.navigate('AddEditEvent')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  eventCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  eventTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default EventListScreen;
