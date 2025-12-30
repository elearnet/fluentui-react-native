import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const notes = [
  { id: '1', title: 'Note 1', body: 'Note 1 body' },
  { id: '2', title: 'Note 2', body: 'Note 2 body' },
  // ...more notes
];

export const NoteListView = () => {
    return (
        <View style={styles.sidebar}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Files</Text>
            </View>
            <FlatList
            data={notes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity>
                <Text style={styles.noteTitle}>{item.title}</Text>
                </TouchableOpacity>
            )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  sidebar: {
      flex: 1,
      backgroundColor: '#f0f0f0', // Placeholder
  },
  header: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
  },
  headerText: {
      fontWeight: 'bold',
  },
  noteTitle: {
      padding: 10,
      fontSize: 14,
  }
});
