import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

export interface MarkdownViewProps {
  content: string;
  style?: any;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, style }) => {
  return (
    <ScrollView style={[styles.container, style]}>
      <Markdown style={markdownStyles}>
        {content}
      </Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 20,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 15,
  },
  code_inline: {
    backgroundColor: '#333',
    color: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  code_block: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginVertical: 10,
  },
  link: {
      color: '#4DA6FF', // Fluent Blue-ish
  }
});
