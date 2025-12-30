import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';

export const SearchView: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text) {
      setResults([]);
      return;
    }
    // Mock search logic
    const mockData = [
      'Note 1.md', 'Meeting Notes.md', 'Project Plan.md', 'Ideas.md', 'Archive.md',
      'Todo.md', 'Budget.md', 'Journal.md'
    ];
    const filtered = mockData.filter(item => item.toLowerCase().includes(text.toLowerCase()));
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search in all files..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.resultsContainer}>
        <Text style={styles.header}>{results.length} results</Text>
        <FlatList
          data={results}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable style={styles.resultItem}>
              <Text style={styles.resultText}>{item}</Text>
              <Text style={styles.matchText}>...found match in content...</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark background
  },
  searchBox: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  input: {
    backgroundColor: '#2D2D2D',
    color: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#444',
  },
  resultsContainer: {
    flex: 1,
    padding: 10,
  },
  header: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  resultItem: {
    marginBottom: 12,
  },
  resultText: {
    color: '#DDD',
    fontWeight: 'bold',
    fontSize: 14,
  },
  matchText: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  }
});
