import React from 'react';
import { View, Text, Button } from 'react-native';

export default function EventCard({ event, onEdit, onDelete, onFavorite }) {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
      <Text style={{ fontWeight: 'bold' }}>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>{event.date}</Text>
      <Button title="Edit" onPress={onEdit} />
      <Button title="Delete" onPress={onDelete} />
      <Button title={event.isFavorite ? 'Unfavorite' : 'Favorite'} onPress={onFavorite} />
    </View>
  );
}
